document.addEventListener('DOMContentLoaded', () => {
    const audios = document.querySelectorAll('.playlist__item'),
        playerInfo = document.querySelector('.audio-info'),
        playerArtist = playerInfo.querySelector('.audio-artist'),
        playerTitle = playerInfo.querySelector('.audio-title'),
        playerSongs = document.querySelectorAll(".audio"),
        timeElapsed = document.querySelector('.time-elapsed'),
        timeDuration = document.querySelector('.time-duration'),
        seek = document.querySelector('.progress-seek'),
        next = document.querySelector('.button__audio-next'),
        prev = document.querySelector('.button__audio-prev'),
        playback = document.querySelector('.playback')


    // Set audios duration
    playerSongs.forEach((sng) => {
        sng.addEventListener('loadedmetadata', function () {
            const duration = Math.round(sng.duration),
                time = formatTime(duration)
            const sibling = this.previousSibling
            sibling.querySelector('.item-duration').setAttribute('raw-duration', duration)
            sibling.querySelector('.item-duration').innerHTML = `${time.minutes}:${time.seconds}`
        })
    })



    function setDuration(song) {
        song.addEventListener('loadedmetadata', function () {
            const duration = Math.round(song.duration),
                time = formatTime(duration)
            timeDuration.innerHTML = `${time.minutes}:${time.seconds}`
            seek.setAttribute('max', duration)
        })
    }

    function setDuration2(song) {
        const sibling = song.previousElementSibling,
            time = sibling.querySelector('.item-duration').innerText,
            duration = sibling.querySelector('.item-duration').getAttribute('raw-duration')

        timeDuration.innerHTML = time
        seek.setAttribute('max', duration)
    }
    // Add info about current song in player view
    function getCurrentInfo(current) {

        playerArtist.innerHTML = current.querySelector('.item-artist').textContent
        playerTitle.innerHTML = current.querySelector('.item-name ').textContent

    }

    getCurrentInfo(document.querySelector('.current'))
    setDuration(document.querySelector('.current').querySelector('audio'))

    // Start / stop when playback clicked
    playback.addEventListener('click', () => {
        const song = document.querySelector('.current').querySelector('audio')
        if (!song.paused) {
            playback.classList.add('show')
        } else {
            playback.classList.remove('show')
        }
        playback.classList.toggle('paused')
        if (song.paused || song.ended) {
            song.play()
            updateProgress(song)
            play.children[0].classList.add('hidden')
            play.children[1].classList.remove('hidden')
        } else {
            song.pause()
            updateProgress(song)
            play.children[0].classList.remove('hidden')
            play.children[1].classList.add('hidden')
        }
    })

    function updateProgress(song) {

        // Set song duration
        setDuration(song)
        setDuration2(song)
        // Allow using range bar
        skipProgress(song)

        // Update time elapsed indicator 
        song.addEventListener('timeupdate', () => {
            const time = formatTime(Math.round(song.currentTime));
            timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
            timeElapsed.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
        })

        // Update progress bar indicator
        song.addEventListener('timeupdate', () => {
            seek.value = Math.floor(song.currentTime)
            const percentage = seek.value / seek.getAttribute('max') * 100
            seek.style.background = `linear-gradient(to right, slategray 0%, slategray ${percentage}%, #fff ${percentage}%, white 100%)`
        })
    }

    function skipProgress(song) {
        // Allow skip ahead on progress bar 
        seek.addEventListener('input', (e) => {
            const skipTo = e.target.dataset.seek ? e.target.dataset.seek : e.target.value
            song.currentTime = skipTo
            seek.value = skipTo
            const percentage = skipTo / seek.getAttribute('max') * 100
            seek.style.background = `linear-gradient(to right, mistyrose 0%, mistyrose ${percentage}%, #fff ${percentage}%, white 100%)`
        })
    }


    const play = document.querySelector('.button__audio-play')


    function playCurrentSong() {
        const currentSong = document.querySelector('.playlist__item.current').querySelector('audio')
        updateProgress(currentSong)
        //     listenVolume(currentSong)
        if (currentSong.paused || currentSong.ended) {
            currentSong.play()
            play.children[0].classList.add('hidden')
            play.children[1].classList.remove('hidden')
            playback.classList.remove('show')
            // playback.classList.remove('show')
            // playback.classList.add('paused')
        } else {
            currentSong.pause()
            playback.classList.add('show')
            play.children[0].classList.remove('hidden')
            play.children[1].classList.add('hidden')
            // playback.classList.add('show')
            // playback.classList.remove('paused')

        }
    }

    // Start / stop playing

    play.addEventListener('click', function () {

        playCurrentSong()
    })


    prev.addEventListener('click', () => {
        const current = document.querySelector('.playlist__item.current'),
            newCurrent = current.previousElementSibling != null ? current.previousSibling : [...current.parentElement.children].slice(-1)[0],
            currentSlide = document.querySelector('.audio-slide.selected'),
            newCurrentSlide = currentSlide.previousElementSibling != null ? currentSlide.previousElementSibling : [...currentSlide.parentElement.children].slice(-1)[0]

        newCurrentSlide.classList.add('selected')
        currentSlide.classList.remove('selected')

        newCurrent.classList.add('current')
        if (!current.querySelector('audio').paused || !current.querySelector('audio').ended) {
            current.querySelector('audio').pause()
        }


        //  listenVolume(newCurrent.querySelector('audio'))
        current.classList.remove('current')
        seek.value = 0
        current.querySelector('audio').currentTime = 0
        newCurrent.querySelector('audio').currentTime = 0
        getCurrentInfo(newCurrent)
        playCurrentSong()
    })

    next.addEventListener('click', () => {
        const current = document.querySelector('.playlist__item.current'),
            newCurrent = current.nextElementSibling != null ? current.nextElementSibling : [...current.parentElement.children].slice(0)[0],
            currentSlide = document.querySelector('.audio-slide.selected'),
            newCurrentSlide = currentSlide.nextElementSibling != null ? currentSlide.nextElementSibling : [...currentSlide.parentElement.children].slice(0)[0]

        newCurrent.classList.add('current')
        current.classList.remove('current')
        newCurrentSlide.classList.add('selected')
        currentSlide.classList.remove('selected')
        // newCurrent.querySelector('audio').addEventListener('volumechange', () => {
        //      changeMuteIcon(newCurrent)
        //  })
        //  listenVolume(newCurrent.querySelector('audio'))
        current.querySelector('audio').pause()
        seek.value = 0
        current.querySelector('audio').currentTime = 0
        newCurrent.querySelector('audio').currentTime = 0
        getCurrentInfo(newCurrent)
        playCurrentSong()
    })




    // function listenVolume(song) {
    const volumeBtn = document.querySelector('.button__sound-state'),
        volumeLow = volumeBtn.childNodes[1],
        volumeHigh = volumeBtn.childNodes[2],
        volumeMute = volumeBtn.childNodes[0],
        volumeBar = document.querySelector('.volume-slider')
    // Update volume based on volume bar value
    volumeBar.addEventListener('input', () => {
        const song = document.querySelector('.playlist__item.current').querySelector('audio')
        if (song.muted) song.muted = false
        song.volume = volumeBar.value
        const percentage = volumeBar.value / volumeBar.getAttribute('max') * 100
        volumeBar.style.background = `linear-gradient(to right, mistyrose 0%, mistyrose ${percentage}%, #fff ${percentage}%, white 100%)`
    })

    function changeMuteIcon(song) {
        [...volumeBtn.childNodes].forEach((btn) => {
            btn.classList.add('hidden')
        })

        volumeBtn.setAttribute('data-title', 'Mute (m)')

        if (song.muted || song.volume === 0) {
            volumeMute.classList.remove('hidden')
            volumeBtn.setAttribute('data-title', 'Unmute (m)')
        } else if (song.volume > 0 && song.volume < 0.51) volumeLow.classList.remove('hidden')
        else volumeHigh.classList.remove('hidden')
        const percentage = volumeBar.value / volumeBar.getAttribute('max') * 100
        volumeBar.style.background = `linear-gradient(to right, mistyrose 0%, mistyrose ${percentage}%, #fff ${percentage}%, white 100%)`
    }

    // // Change icon based on volume level / state (mute / unmuted)
    // song.addEventListener('volumechange', () => {
    //     changeMuteIcon()
    // })

    function turnMute() {
        const song = document.querySelector('.playlist__item.current').querySelector('audio')
        song.muted = !song.muted
        console.log('tuen mute')

        if (song.muted) {
            volumeBar.setAttribute('data-volume', volumeBar.value)
            volumeBar.value = 0
        } else volumeBar.value = volumeBar.dataset.volume
        const percentage = volumeBar.value / volumeBar.getAttribute('max') * 100
        volumeBar.style.background = `linear-gradient(to right, mistyrose 0%, mistyrose ${percentage}%, #fff ${percentage}%, white 100%)`

    }

    // Mute when button clicked
    volumeBtn.addEventListener('click', () => {
        turnMute()
        changeMuteIcon(document.querySelector('.playlist__item.current').querySelector('audio'))
    })
    //  }

    document.addEventListener('keyup', (e) => {
        const {
            key
        } = e
        const song = document.querySelector('.playlist__item.current').querySelector('audio')
        // console.log(key)
        switch (key.toLowerCase()) {
            case ' ':
                playCurrentSong()
                if (song.paused || song.ended) {
                    playback.classList.add('show')
                    playback.classList.remove('paused')
                } else {
                    playback.classList.remove('show')
                    playback.classList.add('paused')
                }
                break
            case 'm':
                turnMute()
                changeMuteIcon(song)
                
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