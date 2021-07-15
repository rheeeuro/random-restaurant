disableScroll = () => {
    document.querySelector('body').addEventListener('touchmove', this.removeEvent, { passive: false });
    document.querySelector('body').addEventListener('onclick', this.removeEvent, { passive: false });
    document.querySelector('body').addEventListener('mousewheel', this.removeEvent, { passive: false });
};

disableScroll();