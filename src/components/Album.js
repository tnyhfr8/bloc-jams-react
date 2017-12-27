import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';
import './../styles/album.css';

function NppDisplay(props) {
  if (props.warn) {
    return (
    <a className="album-song-button"><span className='ion-play'></span></a>
  )} else if (props.barn) {
    return(
      <a className="album-song-button"><span className='ion-pause'></span></a>
    )
  }

  return null;
  }


class Album extends Component {
  constructor(props) {
    super(props);


    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });


    this.state = {
      album: album,
      currentSong: null,
      currentTime: 0,
      duration: null,
      volume: 0.75,
      isPlaying: false,
      playPause: false,
      hoveredSong: ''
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
    this.audioElement.volume = this.state.volume;
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      },
      volumecontrol: e => {
        this.setState({ volume: this.audioElement.volume });
      },

    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);

   }

   componentWillUnmount() {
     this.audioElement.src = null;
     this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
     this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);

   }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
    this.setState({ volume: this.audioElement.volume });
  }

  stop() {
    this.audioElement.stop();
    this.setState({ isPlaying: false })
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();
    }
  }

  formatTime(time) {
    const seconds = Number.parseFloat(time);

    if (Number.isNaN(seconds)) {
             return '-:--';
    }

    const wholeSeconds = Math.floor(seconds);
    const minutes = Math.floor(wholeSeconds / 60);
    const remainingSeconds = wholeSeconds % 60;

    const output = minutes + ":" + remainingSeconds;

    return output;

  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play(newSong);
    }

  handleNextClick() {
      const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play(newSong);
    }

  mouseOver(song) {
      this.setState({hoveredSong: song})
      console.log("nahg");
  }

  mouseOut() {
    console.log("Mouse out!!!");
    this.setState({hoveredSong: ''});
    }

handleTimeChange(e) {
      const newTime = this.audioElement.duration * e.target.value;
      this.audioElement.currentTime = newTime;
      this.setState({ currentTime: newTime });
    }

handleVolumeChange(e) {
         const newVolume = 1 * e.target.value;
         this.audioElement.volume = newVolume;
         this.setState({ volume: newVolume });
       }

   render() {

     return (
       <section className="album">
         <section id="album-info">
            <div className="column half">
            <img id="album-cover-art" src={this.state.album.albumCover} alt={'Album Cover'}/>
            </div>
            <div className="album-details column half">
              <h1 id="album-title">{this.state.album.title}</h1>
              <h2 className="artist">{this.state.album.artist}</h2>
              <div id="release-info">{this.state.album.releaseInfo}</div>
            </div>
          </section>
          <table id="song-list">
             <colgroup>
               <col id="song-number-column" />
               <col id="song-title-column" />
               <col id="song-duration-column" />
             </colgroup>
             <tbody>
                 {
                   this.state.album.songs.map( (song, index,) =>
                    <tr className="song"  onMouseOver={() => this.mouseOver(song)} onMouseOut={() => this.mouseOut()} key={index} onClick={() => this.handleSongClick(song)} >
                      <td>
                        <button>
                          <span className="song-number" >{this.state.currentSong !== song && song !== this.state.hoveredSong ? index+1 : ''}</span>
                          <NppDisplay warn={(song === this.state.hoveredSong && song !== this.state.currentSong) || (song === this.state.currentSong && !this.state.isPlaying)} barn={this.state.currentSong === song && this.state.isPlaying}/>

                        </button>
                      </td>
                      <td className="song-title">{song.title}</td>
                      <td className="song-duration">{song.duration}</td>
                    </tr>
                   )}
             </tbody>
         </table>
         <PlayerBar
           isPlaying={this.state.isPlaying}
           currentSong={this.state.currentSong}
           currentTime={this.audioElement.currentTime}
           duration={this.audioElement.duration}
           //formatTime={this.audioElement.formatTime}
           volume={this.audioElement.volume}
           handleSongClick={() => this.handleSongClick(this.state.currentSong)}
           handlePrevClick={() => this.handlePrevClick()}
           handleNextClick={() => this.handleNextClick()}
           formatTime={(e) => this.formatTime(e)}
           handleTimeChange={(e) => this.handleTimeChange(e)}
           handleVolumeChange={(e) => this.handleVolumeChange(e)}
         />
       </section>
     );
   }
 }

export default Album;
