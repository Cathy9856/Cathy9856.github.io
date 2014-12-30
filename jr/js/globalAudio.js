GlobalAudio = function($item) {
    this._$globalAudio = $item, this._$tip = $("<span></span>"), this.audio = this._$globalAudio.find("audio")[0], this.isAllowManually = !1, this.playState = "ready";
    var theClass = this;
    this._$globalAudio.append(this._$tip), this._$globalAudio.coffee({
        steams: ['<img src="./images/musicalNotes.png"/>', '<img src="./images/musicalNotes.png"/>', '<img src="./images/musicalNotes.png"/>', '<img src="./images/musicalNotes.png"/>', '<img src="./images/musicalNotes.png"/>', '<img src="./images/musicalNotes.png"/>'],
        steamHeight: 100,
        steamWidth: 50
    }), this.audio.autoplay && (this.audio.pause(), $(window).on("load", function() {
        theClass.play()
    })), $(window).on("load", function() {
        theClass.isAllowManually = !0
    }), this._$globalAudio.on($.isPC ? "click" : "tap", function(e) {
        e.preventDefault(), theClass.isAllowManually && (theClass._$globalAudio.is(".z-play") ? theClass.pause() : theClass.play())
    }), $(document).one("touchstart", function() {
        theClass.audio.play()
    })
};
GlobalAudio.prototype.play = function() {
    this._$globalAudio.is(".z-play") || (this.audio.play(), this._$globalAudio.removeClass("z-pause").addClass("z-play"), this._showTip("播放"), this.playState = "playing", $.fn.coffee.start())
}, GlobalAudio.prototype.pause = function() {
    this._$globalAudio.is(".z-pause") || (this.audio.pause(), this._$globalAudio.removeClass("z-play").addClass("z-pause"), this._showTip("暂停"), this.playState = "pause", $.fn.coffee.stop())
}, GlobalAudio.prototype._showTip = function(msg) {
    var theClass = this;
    this._$tip.text(msg), this._$tip.addClass("z-show"), setTimeout(function() {
        theClass._$tip.removeClass("z-show")
    }, 1e3)
};
var globalAudio, $globalAudio = $(".u-globalAudio");
globalAudio = $globalAudio.length ? new GlobalAudio($(".u-globalAudio")) : objectUtil.createEmptyObject(GlobalAudio);