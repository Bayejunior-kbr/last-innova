// Scripts communs à toutes les pages InnovaDEV

// Règle du site : toute page s'ouvre TOUJOURS en haut, quel que soit le lien suivi.
if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
if (location.hash && history.replaceState) { history.replaceState(null, '', location.pathname + location.search); }
function tmGoTop(){ window.scrollTo(0, 0); document.documentElement.scrollTop = 0; document.body && (document.body.scrollTop = 0); }
tmGoTop();
document.addEventListener('DOMContentLoaded', tmGoTop);
window.addEventListener('load', function(){ tmGoTop(); setTimeout(tmGoTop, 0); });
window.addEventListener('pageshow', function(){ tmGoTop(); document.body && document.body.classList.remove('is-leaving'); });
document.documentElement.className += ' js-anim';

$(function(){
  // Parallaxe du héro
  var $hero = $('.tm-page-hero, #accueil');
  function heroParallax(){ $hero.css('background-position', 'center ' + Math.round($(document).scrollTop() * 0.7) + 'px'); }
  $(window).scroll(heroParallax);

  // Navbar au défilement
  function navState(){
    if ($(document).scrollTop() > 80) { $('.tm-navbar').addClass('scroll'); }
    else { $('.tm-navbar').removeClass('scroll'); }
  }
  $(window).scroll(navState); navState();

  // Fermer le menu mobile après un clic
  $('#tmNav a').on('click', function(){ $('.navbar-collapse').removeClass('show'); });

  // Défilement doux pour les ancres internes
  $('a[href^="#"]').on('click', function(e){
    var h = this.hash;
    if (h && $(h).length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $(h).offset().top - 60 }, 600, 'easeInOutExpo');
    }
  });

  // Filtres du portfolio
  $('.tm-filter').on('click', function(){
    var f = $(this).data('filter');
    $('.tm-filter').removeClass('active').attr('aria-pressed', 'false');
    $(this).addClass('active').attr('aria-pressed', 'true');
    $('.tm-project-col').each(function(){
      var show = f === 'all' || $(this).data('cat') === f;
      $(this).toggleClass('is-hidden', !show);
    });
  });

  // Liens pas encore renseignés (maquette)
  $('a[href="#"]').on('click', function(e){ e.preventDefault(); }).attr('title', 'À compléter');

  // Formulaire de la page Contact
  function formData(){
    return {
      nom: $.trim($('#f-name').val()), ent: $.trim($('#f-company').val()),
      mail: $.trim($('#f-email').val()), tel: $.trim($('#f-phone').val()),
      service: $('#f-service').val(), pref: $('input[name=pref]:checked').val(),
      msg: $.trim($('#f-msg').val())
    };
  }
  function formValid(d){
    var ok = d.nom && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.mail) && d.msg;
    $('#f-error').toggle(!ok);
    return ok;
  }
  function formText(d){
    return 'Nom : ' + d.nom + (d.ent ? '\nEntreprise : ' + d.ent : '') + '\nE-mail : ' + d.mail +
      (d.tel ? '\nTéléphone : ' + d.tel : '') + '\nService : ' + d.service +
      '\nRecontact par : ' + d.pref + '\n\n' + d.msg;
  }
  $('#projectForm').on('submit', function(e){
    e.preventDefault();
    var d = formData(); if (!formValid(d)) return;
    window.location.href = 'mailto:innovadevsn@gmail.com?subject=' +
      encodeURIComponent('Demande de projet — ' + d.service + ' — ' + d.nom) + '&body=' + encodeURIComponent(formText(d));
  });
  $('#sendWa').on('click', function(){
    var d = formData(); if (!formValid(d)) return;
    window.open('https://wa.me/221757457002?text=' + encodeURIComponent('Bonjour InnovaDEV,\n\n' + formText(d)), '_blank');
  });

  // ---------- Animations d'apparition au défilement ----------
  var groups = [
    ['.tm-section-title, .tm-section-desc, .tm-intro-text, .tm-maquette-note, .tm-chips, .tm-filters', ''],
    ['.tm-svc-card, .tm-project, .tm-member, .tm-value, .tm-contact-card, .tm-mv-card, .tm-target', ''],
    ['.tm-step, .tm-why, .tm-faq details, .tm-box', ''],
    ['.tm-service .col-lg-6, #apropos-court .col-lg-6, .tm-form-light', 'reveal-left'],
    ['.tm-about-img, .tm-side, .tm-map', 'reveal-right'],
    ['#cta .container, .tm-service-num', 'reveal-zoom']
  ];
  $.each(groups, function(_, g){ $(g[0]).addClass('reveal ' + g[1]); });
  // léger décalage entre les cartes d'une même rangée
  $('.row').each(function(){
    $(this).children().each(function(i){
      $(this).find('.reveal').first().css('transition-delay', (i % 4) * 0.08 + 's');
    });
  });
  $('.tm-faq details').each(function(i){ $(this).css('transition-delay', i * 0.06 + 's'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $('.reveal').each(function(){ io.observe(this); });
  } else {
    $('.reveal').addClass('is-visible');
  }

  // Sécurité : la page ne doit jamais rester invisible
  document.body.classList.remove('is-leaving');

  // Bouton « haut de page »
  $('.tm-back-top').on('click', function(e){ e.preventDefault(); $('html, body').animate({ scrollTop: 0 }, 600, 'easeInOutExpo'); });

  $('#year').text(new Date().getFullYear());
});
