const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = "F8_PLAYER"

const cd = $(".cd")
const heading = $("header h2")
const cdThumb = $(".cd-thumb")
const audio = $("#audio")
const playBtn = $(".btn-toggle-play")
const player = $(".player")
const progress = $("#progress")
const btnNext = $(".btn-next")
const btnPrev = $(".btn-prev")
const btnRandom = $(".btn-random")
const btnRepeat = $(".btn-repeat")
const playList = $(".playlist")
const app = {
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Vì Mẹ Anh Bắt Chia Tay",
            singer: "Miu Lê, Karik",
            path: "./assets/music/ViMeAnhBatChiaTay.mp3",
            image: "./assets/imgs/vi-me-anh-bat-chia-tay.jpg"
        },
        {
            name: "Chạy về nơi phía anh",
            singer: "Khắc Việt",
            path: "./assets/music/ChayVeNoiPhiaAnh.mp3",
            image: "./assets/imgs/chay-ve-noi-phia-anh.jpg"
        },
        {
            name: "Gác Lại Âu Lo",
            singer: "Miu Lê",
            path: "./assets/music/GacLaiAuLo.mp3",
            image: "./assets/imgs/gac-lai-au-lo.jpg"
        },
        {
            name: "Hai Mươi Hai",
            singer: "Amee",
            path: "./assets/music/HaiMuoiHai22.mp3",
            image: "./assets/imgs/hai-muoi-hai.jpg"
        },
        {
            name: "Những Chuyến Đi Xa",
            singer: "V.A",
            path: "./assets/music/NhungChuyenDiXa.mp3",
            image: "./assets/imgs/nhung-chuyen-di-xa.jpg"
        },
        {
            name: "Tình Bạn Diệu Kỳ",
            singer: "Amee",
            path: "./assets/music/TinhBanDieuKy.mp3",
            image: "./assets/imgs/tinh-ban-dieu-ky.jpg"
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url(${song.image})">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playList.innerHTML = htmls.join("")
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })

    },
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        //xu ly cd quay va dung
        const cdThumbAnimate = cdThumb.animate([
            { transform: "rotate(360deg)" }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //xu ly phong to thu nho cd
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        //xu ly khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        //khi bai hat dc play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add("playing")
            cdThumbAnimate.play()
        }
        //khi bai hat bi pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove("playing")
            cdThumbAnimate.pause()
        }
        //khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPer = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPer
            }
            // console.log(Math.floor(audio.currentTime / audio.duration * 100));
        }
        //xu ly khi tua bai hat
        progress.onchange = function (event) {
            const seekTime = audio.duration / 100 * event.target.value
            audio.currentTime = seekTime
            //    console.log(seekTime)
        }
        //khi next song
        btnNext.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.srollToCurrentSong()

        }
        //khi ramdom songs
        btnPrev.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.srollToCurrentSong()

        }
        //xu ly khi lap lai song
        btnRepeat.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig("isRepeat", _this.isRepeat)
            btnRepeat.classList.toggle("active", _this.isRepeat)
        }
        //khi random songs
        btnRandom.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig("isRandom", _this.isRandom)
            btnRandom.classList.toggle("active", _this.isRandom)
        }
        //xu ly next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()

            } else {
                btnNext.click()

            }
        }
        //lang nghe hanh vi click vao playlist
        playList.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)")
            if (songNode || e.target.closest(".option")) {
                //xu ly khi click vao song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                    // console.log(songNode.dataset.index)
                }
                //xu ly vao song cua option
                else if (e.target.closest(".option")) {
                    //tu xu ly
                }
            }
        }
    },
    srollToCurrentSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        }, 300)
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()

    },
    playRandomSong: function () {
        let newIndexSong
        do {
            newIndexSong = Math.floor(Math.random() * this.songs.length)
        } while (newIndexSong === this.currentIndex)
        this.currentIndex = newIndexSong;
        this.loadCurrentSong()
    },
    start: function () {
        //gan cau hinh tu config vao ung dung
        this.loadConfig()
        //Dinh nghia cac thuoc tinh cho obj
        this.defineProperties()
        //lang nghe cac su kien trong dom events
        this.handleEvents()
        //tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong()
        //render playlist
        this.render()
        //hien thi trang thai ban dau cua button repeat va random
        btnRandom.classList.toggle("active", this.isRandom)
        btnRepeat.classList.toggle("active", this.isRepeat)
    }
    
}
app.start()
