jQuery(document).foundation();
/*
These functions make sure WordPress
and Foundation play nice together.
*/
jQuery(document).ready(function() {

  // Remove empty P tags created by WP inside of Accordion and Orbit
  jQuery('.accordion p:empty, .orbit p:empty').remove();

   // Makes sure last grid item floats left
  jQuery('.archive-grid .columns').last().addClass( 'end' );

  // Adds Flex Video to YouTube and Vimeo Embeds
  jQuery('iframe[src*="youtube.com"], iframe[src*="vimeo.com"]').each(function() {
    if ( jQuery(this).innerWidth() / jQuery(this).innerHeight() > 1.5 ) {
      jQuery(this).wrap("<div class='widescreen flex-video'/>");
    } else {
      jQuery(this).wrap("<div class='flex-video'/>");
    }
  });
  
  jQuery('img[usemap]').rwdImageMaps();

  //Featherlight lightbox gallery function
  jQuery('.gallery a').featherlightGallery({
      previousIcon: '«',
      nextIcon: '»',
      galleryFadeIn: 300,
      openSpeed: 300
  });

  // Not needed Responsive Navigation Dropdown Patch for a Bug in v6.3.1
  //jQuery(window).on('changed.zf.mediaquery', function() {
  //  jQuery('.is-dropdown-submenu.invisible').removeClass('invisible');
  //});
  
});