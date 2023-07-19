/* @author web@2dsd.ru | webtitov.ru */
'use strict';

document.addEventListener("DOMContentLoaded", () => {
  const WebT = {};

  WebT.settings = {
    modal_active_class: '--modal-show',
    header_sticky_pos: 830
  };

  WebT.elements = {
    scroll_links: document.querySelectorAll('a[href^="#"]'),
    modal_toggle: document.querySelectorAll('[data-modal-toggle]'),
    modal_box: document.querySelectorAll('[data-modal]'),
    overlay: document.querySelector('.theme-overlay'),
    close_modal: document.querySelectorAll('[data-modal-close]'),
    project_images: document.querySelectorAll('.js-scrollable-image'),
    tooltip_links: document.querySelectorAll('.js-tooltip'),
    ajax_forms: document.querySelectorAll('.ajax-form'),
    agree_cookie: document.querySelector(".js-cookie-close"),
    cookie_msg: document.querySelector(".cookie-msg"),
    close_cookie: document.querySelector(".cookie-msg")
  };

  /* Preloader */
  /*document.onreadystatechange = function () {
    if (document.readyState === "complete") {
      setTimeout(() => {
        document.body.classList.add('--page-loaded');
      }, 1500);
    }
  }*/
  setTimeout(() => {
    document.body.classList.add('--page-loaded');
  }, 1800);

  const isMobile = window.matchMedia(
    "only screen and (max-width: 960px)"
  ).matches;

  /* Check if click outside target element */
  const isClickOutside = ($target, $class) => {
    const closeTarget = (e) => {
      if (!e.target.classList.contains($class)) {
        $target.classList.remove($class);
      }
    };
    if ($target === 0) {
      document.body.removeEventListener('click', closeTarget);
    } else {
      document.body.addEventListener('click', closeTarget);
    }
  };

  /* Close all modals */
  const closeModals = () => {
    // close all modals
    for (let i=0; i < WebT.elements.modal_box.length; i++) {
      WebT.elements.modal_box[i].classList.remove(WebT.settings.modal_active_class);
    }
    // remove active classes from modal toggle buttons
    for (let i=0; i < WebT.elements.modal_toggle.length; i++) {
      WebT.elements.modal_toggle[i].classList.remove(WebT.settings.modal_active_class);
    }
    // close overlay
    WebT.elements.overlay.classList.remove(WebT.settings.modal_active_class);
  }

  /* Stick header on scroll */
  const changeHeaderClass = () => {
    let scrollPosY = window.pageYOffset | document.body.scrollTop,
      header = document.querySelector('.website-menu');

    if(scrollPosY  > WebT.settings.header_sticky_pos) {
      header.classList.add('--blue-bg');
    } else if(scrollPosY <= WebT.settings.header_sticky_pos) {
      header.classList.remove('--blue-bg');
    }
  };

  /* Modals */
  (() => {
    // Add click event to close modals
    for (let i=0; i < WebT.elements.close_modal.length; i++) {
      WebT.elements.close_modal[i].addEventListener('click', () => {
        closeModals();
      });
    }
    // Add click event to open target modal
    for (let i=0; i < WebT.elements.modal_toggle.length; i++) {
      WebT.elements.modal_toggle[i].addEventListener('click', () => {
        let this_toggle = WebT.elements.modal_toggle[i],
            target_modal = this_toggle.getAttribute('data-modal-toggle');
        // if nav modal opened
        if (target_modal === 'nav' && this_toggle.classList.contains(WebT.settings.modal_active_class)) {
          closeModals();
          WebT.elements.modal_toggle[i].classList.remove(WebT.settings.modal_active_class);
        } else {
          closeModals();
          document.querySelector(`[data-modal='${target_modal}']`).classList.add(WebT.settings.modal_active_class);
          WebT.elements.overlay.classList.add(WebT.settings.modal_active_class);
          WebT.elements.modal_toggle[i].classList.add(WebT.settings.modal_active_class);
        }
      });
    }
  })();

  /* Pricing tabs */
  (() => {
    let tabs_buttons = document.querySelectorAll('[data-tab]');
    let tabs_boxes = document.querySelectorAll('[data-tab-box]');
    let tab_active_class = '--active-tab';


    const hideTabs = () => {
      for (let i=0; i < tabs_buttons.length; i++) {
        tabs_buttons[i].classList.remove(tab_active_class);
        tabs_boxes[i].classList.remove(tab_active_class);
      }
    }

    for (let j=0; j < tabs_buttons.length; j++) {
      tabs_buttons[j].addEventListener('click', () => {
        if (tabs_buttons[j].classList.contains(tab_active_class)) {
          return false;
        } else {
          hideTabs();
          tabs_buttons[j].classList.add(tab_active_class);
          tabs_boxes[j].classList.add(tab_active_class);

        }
      });
    }



  })();

  /* Company box tabs */
  (() => {
    let faq_buttons = document.querySelectorAll('.js-accordion__toggle');

    const closeAllTabs = () => {
      for (let x=0; x < faq_buttons.length; x++) {
        faq_buttons[x].classList.remove('--item-opened');
      }
    }

    for (let i=0; i < faq_buttons.length; i++) {
      faq_buttons[i].addEventListener('click', () => {
        if (faq_buttons[i].classList.contains('--item-opened')) {
          faq_buttons[i].classList.remove('--item-opened');
          closeAllTabs();
        } else {
          closeAllTabs();
          faq_buttons[i].classList.add('--item-opened');
          let target = faq_buttons[i].getBoundingClientRect().top + window.pageYOffset - 50;
          window.scrollTo({top: target, behavior: 'smooth'});
        }
      });
    }
  })();

  /* Anchor smooth scroll */
  (() => {
    WebT.elements.scroll_links.forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        closeModals();
        const offset = -30,
          element = document.querySelector(this.getAttribute('href')),
          target = element.getBoundingClientRect().top + window.pageYOffset + offset;
        window.scrollTo({top: target, behavior: 'smooth'});
      });
    });
  })();

  /* AJAX form send */
  (() => {
    function sendData($data) {
      const XHR = new XMLHttpRequest();

      XHR.addEventListener("error", function (event) {
        document.body.classList.add('--form-error');
        setTimeout(() => {
          document.body.classList.remove('--form-error');
        }, 3000);
        console.log('Form error');
      });

      XHR.addEventListener("load", function (event) {
        if (document.body.classList.contains(WebT.settings.modal_active_class)) {
          document.body.classList.remove(WebT.settings.modal_active_class);
        }

        document.body.classList.add('--form-sent');
        setTimeout(() => {
          document.body.classList.remove('--form-sent');
        }, 3000);

        for (let value of $data.values()) {
          console.log(value);
        }
      });

      XHR.open('POST', '/form-send.php');
      XHR.send($data);
    }

    // Вешаем на все формы свое событие отправки
    for (let i = 0; i < WebT.elements.ajax_forms.length; i++) {
      WebT.elements.ajax_forms[i].addEventListener('submit', (event) => {

        let form_button = event.target.querySelector('button[type="submit"]');
        const form_data = new FormData(event.target);

        event.preventDefault();

        sendData(form_data);
        form_button.classList.add('--disabled-button');
        form_button.setAttribute('disabled', 'disabled');
        WebT.elements.ajax_forms[i].reset();
      }, false);
    }
  })();

  /* Video autoplay fix */
  (() => {
    let vid = document.getElementById("about_video");
    vid.autoplay = true;
    vid.load();
  })();

  /* Cookie */
  (()=> {
    const setCookie = (cname, cvalue, exdays) => {
        const d = new Date;
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1e3);
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
      }
    ;
    const getCookie = cname => {
        let name = cname + "=";
        let ca = document.cookie.split(";");
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === " ") {
            c = c.substring(1)
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
          }
        }
        return ""
      }
    ;
    WebT.elements.close_cookie.addEventListener("click", () => {
        WebT.elements.cookie_msg.classList.remove("--cookie-show");
        WebT.elements.cookie_msg.classList.add("--cookie-closed")
      }
    );
    let cookie_msg = getCookie("cookie_msg_smsetup");
    if (cookie_msg === "") {
      WebT.elements.cookie_msg.classList.add("--cookie-show");

      WebT.elements.agree_cookie.addEventListener("click", () => {
        WebT.elements.cookie_msg.classList.remove("--cookie-show");
        WebT.elements.cookie_msg.classList.add("--cookie-closed");
        setCookie("cookie_msg_smsetup", "cookie_msg_smsetup", 365)
      });

    } else {
      WebT.elements.cookie_msg.classList.add("--cookie-closed");
    }
  })();




        /* Functions init */
  window.addEventListener('load', changeHeaderClass);
  window.addEventListener('scroll', changeHeaderClass);

  if (isMobile) {
    WebT.settings.header_sticky_pos = 650;
  }
});