import"./hoisted.uc0jJ9DK.js";document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll('.premium-card[data-variant="premium"], .premium-card[data-variant="interactive"]').forEach(e=>{let r;function o(n){const c=n.clientX,m=n.clientY,s=c-r.x,a=m-r.y,i={x:s-r.width/2,y:a-r.height/2};e.style.transform=`
          perspective(1000px)
          rotateX(${i.y/20}deg)
          rotateY(${-i.x/20}deg)
          scale3d(1.02, 1.02, 1.02)
        `,e.querySelector(".shine-effect").style.background=`
          radial-gradient(
            circle at ${s}px ${a}px,
            rgba(255, 255, 255, 0.2),
            transparent 50%
          )
        `}e.addEventListener("mouseenter",n=>{r=e.getBoundingClientRect(),document.addEventListener("mousemove",o)}),e.addEventListener("mouseleave",()=>{document.removeEventListener("mousemove",o),e.style.transform="",e.querySelector(".shine-effect").style.background=""})})});const l={threshold:.1,rootMargin:"50px"},u=new IntersectionObserver(t=>{t.forEach(e=>{e.isIntersecting&&(e.target.style.opacity="1",e.target.style.transform="translateY(0)")})},l);document.querySelectorAll(".premium-card").forEach(t=>{t.style.opacity="0",t.style.transform="translateY(20px)",t.style.transition="opacity 0.6s ease, transform 0.6s ease",u.observe(t)});
