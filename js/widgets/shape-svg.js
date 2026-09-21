/* Shapes are drawn as real SVG so they stay crisp at any size. */
export function shapeSVG(s, size){
  return '<svg class="shape-svg" viewBox="0 0 100 100" role="img" aria-label="'+s.name+'" style="width:'+(size||'min(54vw,190px)')+';height:'+(size||'min(54vw,190px)')+'">'+
    '<g fill="'+s.hue+'" stroke="rgba(0,0,0,.12)" stroke-width="2">'+s.svg+'</g></svg>';
}
