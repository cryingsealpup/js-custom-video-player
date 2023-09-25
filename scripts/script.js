document.addEventListener('DOMContentLoaded', () => {
    const playback = document.querySelector('.playback'), 
          video = document.querySelector('.video'), 
          videoControls = document.querySelector('.controls')

    // Hide default controls
    if (!!document.createElement('video').canPlayType) {
        video.controls = false
        videoControls.classList.remove('hidden')
    }

    // Toggle play / pause button visible state and play / pause video on click
    const play = document.querySelector('.button__play-state')
    play.addEventListener('click', function () {
        this.classList.toggle('paused')
        if (video.paused || VideoPlaybackQuality.ended)  {
            video.play()
            playback.classList.remove('show') 
            playback.classList.add('paused')   
        }
        else {
            video.pause()
            playback.classList.add('show')
            playback.classList.remove('paused')   
              
        }
    })
    
    // Start / stop when playback clicked
    playback.addEventListener('click', () => {
        playback.classList.toggle('show')     
        playback.classList.toggle('paused')        
        if (video.paused || VideoPlaybackQuality.ended)  {
            video.play()
            play.classList.add('paused')
        }
        else {
            video.pause()
            play.classList.remove('paused')   
        }
    })

    // Change time left behind and total duration markup
    const timeElapsed = document.querySelector('.time-elapsed'),
          timeDuration = document.querySelector('.time-duration'), 
          seek = document.querySelector('.progress-seek')

    // Set video duration
    video.addEventListener('loadedmetadata', () => { 
        const duration = Math.round(video.duration), time = formatTime(duration)
        timeDuration.innerHTML = `${time.minutes}:${time.seconds}`
        seek.setAttribute('max', duration)
        timeDuration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
    })

    // Update time elapsed indicator 
    video.addEventListener('timeupdate', () => {
        const time = formatTime(Math.round(video.currentTime));
        timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
        timeElapsed.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
    })

    // Update progress bar indicator
    video.addEventListener('timeupdate', () => {
        seek.value = Math.floor(video.currentTime)
    })

    
    const tooltip = document.querySelector('.progress-tooltip')
    // Show tooltip on progress bar hover
    seek.addEventListener('mousemove', (e) => {
        const skipTo = Math.round((e.offsetX / e.target.clientWidth) * parseInt(e.target.getAttribute('max'), 10))
        seek.setAttribute('data-seek', skipTo)
        const t = formatTime(skipTo)
        tooltip.textContent = `${t.minutes}:${t.seconds}`
        const rect = video.getBoundingClientRect()
        tooltip.style.left = `${e.pageX - rect.left}px`
    })

    // Allow skip ahead on progress bar 
    seek.addEventListener('input', (e) => {
        const skipTo = e.target.dataset.seek ? e.target.dataset.seek : e.target.value
        video.currentTime = skipTo
        seek.value = skipTo
    })

    const volumeBtn = document.querySelector('.button__sound-state'), 
          volumeLow = volumeBtn.childNodes[1],
          volumeHigh = volumeBtn.childNodes[2],
          volumeMute = volumeBtn.childNodes[0],
          volumeBar = document.querySelector('.volume-slider')
    
    // Update volume based on volume bar value
    volumeBar.addEventListener('input', () => {
        if (video.muted) video.muted = false
        video.volume = volumeBar.value
    })

    function changeMuteIcon() {
        [...volumeBtn.childNodes].forEach((btn) => {btn.classList.add('hidden')})
        volumeBtn.setAttribute('data-title', 'Mute (m)')

        if (video.muted || video.volume === 0) {
            volumeMute.classList.remove('hidden')
            volumeBtn.setAttribute('data-title', 'Unmute (m)')
        }
        else if (video.volume > 0 && video.volume < 0.51) volumeLow.classList.remove('hidden')
        else volumeHigh.classList.remove('hidden')
    }

    // Change icon based on volume level / state (mute / unmuted)
    video.addEventListener('volumechange', () => {
        changeMuteIcon()
    })

    function turnMute() {
        video.muted = !video.muted
        if (video.muted) {
            volumeBar.setAttribute('data-volume', volumeBar.value)
            volumeBar.value = 0
        }
        else volumeBar.value = volumeBar.dataset.volume
    }

    // Mute when button clicked
    volumeBtn.addEventListener('click', () => {
        turnMute()
    })

    document.addEventListener('keyup', (e) => {
        const { key } = e
       // console.log(key)
        switch(key.toLowerCase()) {
          case 'p':
            if (video.paused || VideoPlaybackQuality.ended)  {
                video.play()
                playback.classList.remove('show') 
                playback.classList.add('paused')   
                play.classList.add('paused')
            }
            else {
                video.pause()
                playback.classList.add('show')
                playback.classList.remove('paused')   
                play.classList.remove('paused')
            }
            break
          case 'm':
            changeMuteIcon()
            turnMute()
            break
        }
    }) 
})

// formatTime takes a time length in seconds and returns the time in
// minutes and seconds
function formatTime(timeInSeconds) {
    const result = new Date(timeInSeconds * 1000).toISOString().slice(11, 19).split(':');
    return {
      minutes: result[1],
      seconds: result[2],
    }
  }