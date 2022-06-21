const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const cd = $(".cd")
const heading = $("header h2")
const cdThumb = $(".cd-thumb")
const audio = $("#audio")
const playBtn = $(".btn-toggle-play")
const player = $(".player")
const progress = $("#progress")
const app = {
    currentIndex: 0,
    isPlaying: false,
    songs: [
        {
            name: "Chạy về nơi phía anh",
            singer: "Khắc Việt",
            path: "./assets/music/ChayVeNoiPhiaAnh.mp3",
            image: "./assets/imgs/chay-ve-noi-phia-anh.jpg"
        },
        {
            name: "Gác lại âu lo",
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
        const htmls = this.songs.map(song => {
            return `
                <div class="song">
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
        $(".playlist").innerHTML = htmls.join("")
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
        const cdThumbAnimate = cdThumb.animate([{
                transform:"rotate(360deg)"
            }],
            {duration:10000,//10 seconds
            interations:Infinity
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
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add("playing")
            cdThumbAnimate.play()
        }
        //khi bai hat bi pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove("playing")
            cdThumbAnimate.pause()
        }
        //khi tien do bai hat thay doi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPer = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPer
            }
            console.log(Math.floor(audio.currentTime / audio.duration * 100));
        }
        //xu ly khi tua bai hat
        progress.onchange = function(event){
           const seekTime = audio.duration / 100 * event.target.value
           audio.currentTime = seekTime
        //    console.log(seekTime)
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    start: function () {
        //Dinh nghia cac thuoc tinh cho obj
        this.defineProperties()
        //lang nghe cac su kien trong dom events
        this.handleEvents()
        //tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong()
        //render playlist
        this.render()
    }
}
app.start()
