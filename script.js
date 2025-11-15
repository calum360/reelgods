// Refactored viewer script preserving correct border behavior

const viewer = document.getElementById('domainViewer');
//const highlightFrame = document.createElement('div');				//Commented out just now
let resizeTimeout;


const openBtn = document.getElementById('openViewerBtn');

const originalModalContent = document.querySelector('#contactModal .modal-content').innerHTML;



let allCards = Array.from(document.querySelectorAll('.domainCard'));



const closeBtn = document.getElementById('desktopCloseBtn');
const viewerToggle = document.getElementById('viewerToggle');
const mobileCloseBtn = document.getElementById('mobileCloseBtn');
const domainCards = document.querySelectorAll('.domainCard');





//added this in
const highlightFrame = document.createElement('div');
highlightFrame.className = 'highlight-frame';
document.querySelector('.domainCards')?.appendChild(highlightFrame);
//end add


let previousCard = null;

let scrollTimeout = null;
let userScrolling = false;

let currentCardIndex = 0;



scrollToCard(currentCardIndex); // initialize first card as active

const overlay = document.getElementById('modalOverlay');








highlightFrame.className = 'highlight-frame';
viewer.appendChild(highlightFrame);

const hamburgerIcon = document.getElementById('hamburgerIcon');
const closeIcon = document.getElementById('closeIcon');

let lastHighlighted = null;


function updateSlideCounter(currentIndex, totalSlides) {
  const counters = document.querySelectorAll('.slideCounter');
  counters.forEach((counter, index) => {
    counter.textContent = index === currentIndex ? `${currentIndex + 1} / ${totalSlides}` : '';
  });
}

function updateNavAlignment(currentIndex, totalCards) {
  const navButtons = document.querySelectorAll('.navButtons');
  const allCards = document.querySelectorAll('.domainCard');
  


  allCards.forEach((card, index) => {
    const navWrap = card.querySelector('.navButtons');
    const prevBtn = card.querySelector('.prevCardBtn');
    const nextBtn = card.querySelector('.nextCardBtn');

    if (!navWrap || !prevBtn || !nextBtn) return;

    const isFirst = index === 0;
    const isLast = index === totalCards - 1;

    prevBtn.style.display = isFirst ? 'none' : 'inline-flex';
    nextBtn.style.display = isLast ? 'none' : 'inline-flex';

    if (isFirst || isLast) {
      navWrap.classList.add('single');
    } else {
      navWrap.classList.remove('single');
    }
  });
}




function updateNavButtons() {
  const cards = Array.from(document.querySelectorAll('.domainCard'));
  cards.forEach((card, index) => {
    const prevBtn = card.querySelector('.prevCardBtn');
    const nextBtn = card.querySelector('.nextCardBtn');

    if (prevBtn) prevBtn.classList.toggle('hidden', index === 0);
    if (nextBtn) nextBtn.classList.toggle('hidden', index === cards.length - 1);
  });
}
/*
9function scrollToCard(index) {
  const cards = document.querySelectorAll('.domainCard');
  if (index < 0 || index >= cards.length) return;

  const card = cards[index];
  const top = card.offsetTop;
  
  

  viewer.scrollTo({
    top: top,
    behavior: 'smooth'
  });

  // Update buttons
  const prevButton = card.querySelector('.prevCard');
  const nextButton = card.querySelector('.nextCard');

  // Show/hide based on position
  if (index === 0) {
    if (prevButton) prevButton.style.display = 'none';
  } else {
    if (prevButton) prevButton.style.display = '';
  }

  if (index === cards.length - 1) {
    if (nextButton) nextButton.style.display = 'none';
  } else {
    if (nextButton) nextButton.style.display = '';
  }
}*/

function collapseAllDescriptions() {
  document.querySelectorAll('.domainDescription.expanded').forEach(desc => {
    desc.classList.remove('expanded');
    const toggle = desc.closest('.cardContent').querySelector('.toggleDesc');
    if (toggle) toggle.textContent = 'Read More';
  });
}





function moveHighlight() {
    const activeCard = document.querySelector('.domainCard.activeCard');
    if (!highlightFrame || !activeCard) return;

    const viewerRect = viewer.getBoundingClientRect();
    const cardRect = activeCard.getBoundingClientRect();

    highlightFrame.style.top = `${cardRect.top - viewerRect.top}px`;
    highlightFrame.style.left = `${cardRect.left - viewerRect.left}px`;
    highlightFrame.style.width = `${cardRect.width}px`;
    highlightFrame.style.height = `${cardRect.height}px`;
    highlightFrame.style.opacity = 1;
    highlightFrame.style.display = 'block';
}

function scrollToCard(index) {
	collapseAllDescriptions();
	
  const cards = document.querySelectorAll('.domainCard');
  if (index < 0 || index >= cards.length) return;

  // Clear all activeCard and remove buttons from all cards
  cards.forEach(card => {
    card.classList.remove('activeCard');
    const next = card.querySelector('.nextCard');
    const prev = card.querySelector('.prevCard');
    if (next) next.style.display = 'none';
    if (prev) prev.style.display = 'none';
  });

  const card = cards[index];
  const top = card.offsetTop;

  // Add activeCard class
  card.classList.add('activeCard');

  // Scroll to it
  viewer.scrollTo({
    top: top,
    behavior: 'smooth'
  });
	
  
if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
  setTimeout(() => {
    viewer.scrollTo({ top: top + 1 });
    viewer.scrollTo({ top: top });
  }, 10);
}
  

	setTimeout(() => {
    updateHighlight();
}, 400);


  // Show nav buttons only on active card
  const prevButton = card.querySelector('.prevCard');
  const nextButton = card.querySelector('.nextCard');

  if (prevButton) {
    prevButton.style.display = index === 0 ? 'none' : '';
  }
  if (nextButton) {
    nextButton.style.display = index === cards.length - 1 ? 'none' : '';
  }

  // Track index globally
  currentCardIndex = index;
  updateNavAlignment(currentCardIndex, document.querySelectorAll('.domainCard').length);
  updateSlideCounter(currentCardIndex, document.querySelectorAll('.domainCard').length);
	localStorage.setItem('lastCardIndex', index);

}



document.querySelectorAll('.nextCardBtn').forEach(btn => {
  btn.addEventListener('click', () => {
   
	scrollToCard(currentCardIndex + 1);
	gtag('event', 'card_viewed');
  });
});

document.querySelectorAll('.prevCardBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    scrollToCard(currentCardIndex - 1);
gtag('event', 'card_viewed');
  });
});


function scrollToClosestCard() {
	const cards = document.querySelectorAll('.domainCard');
	cards.forEach((c, i) => {
  const prev = c.querySelector('.prevCard');
  const next = c.querySelector('.nextCard');
  if (prev) prev.style.display = '';
  if (next) next.style.display = '';
});

	
	

  const viewerRect = viewer.getBoundingClientRect();
  const viewerTop = viewerRect.top;
  const viewerHeight = viewer.clientHeight;

  let closestCard = null;
  let maxVisibleRatio = 0;

  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const visibleTop = Math.max(rect.top, viewerTop);
    const visibleBottom = Math.min(rect.bottom, viewerTop + viewerHeight);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const ratio = visibleHeight / rect.height;

    if (ratio > maxVisibleRatio) {
      maxVisibleRatio = ratio;
      closestCard = card;
    }
  });

  if (closestCard) {
    closestCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}


function updateHighlight() {

  const cards = document.querySelectorAll('.domainCard');
  if (!highlightFrame || cards.length === 0) return;

  const viewerRect = viewer.getBoundingClientRect();
  const viewerTop = viewerRect.top;
  const viewerScrollTop = viewer.scrollTop;

  const viewerHeight = viewer.clientHeight;

  let closestCard = null;
  let maxVisibleRatio = 0;

  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const visibleTop = Math.max(rect.top, viewerTop);
    const visibleBottom = Math.min(rect.bottom, viewerTop + viewerHeight);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const ratio = visibleHeight / rect.height;

    if (ratio >= 0.6 && ratio > maxVisibleRatio) {
      maxVisibleRatio = ratio;
      closestCard = card;
	  
	   cards.forEach(card => {
  if (card === closestCard) {
    card.classList.add('activeCardColor');
  } else {
    card.classList.remove('activeCardColor');
  }
});

	  
	  if (closestCard.classList.contains('bonusPromoCard')) {
  closestCard.classList.add('reveal');
} else {
  document.querySelectorAll('.bonusPromoCard').forEach(card => {
    card.classList.remove('reveal');
  });
}

	  
	  
    }
  });
  

if (closestCard && closestCard !== lastHighlighted) {
  lastHighlighted = closestCard;
  
    // Show/hide next/prev buttons based on card position
 // const allCards = Array.from(document.querySelectorAll('.domainCard'));
  allCards = Array.from(document.querySelectorAll('.domainCard'));
	const currentIndex = allCards.indexOf(closestCard);
  
  

  allCards.forEach((card, index) => {
    const prevBtn = card.querySelector('.prevCardBtn');
    const nextBtn = card.querySelector('.nextCardBtn');

   if (prevBtn) prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
if (nextBtn) nextBtn.style.visibility = index === allCards.length - 1 ? 'hidden' : 'visible';

  });


  const rect = closestCard.getBoundingClientRect();
  const top = rect.top - viewerRect.top + viewerScrollTop;
  const left = rect.left - viewerRect.left;

  // Fade border into place
  highlightFrame.style.opacity = '0.65';
  highlightFrame.style.top = `${top}px`;
  highlightFrame.style.left = `${left}px`;
  highlightFrame.style.width = `${rect.width}px`;
  highlightFrame.style.height = `${rect.height}px`;
  highlightFrame.style.display = 'block';

  setTimeout(() => {
    highlightFrame.style.opacity = '1';
	
	
  },450);

 
}



if (closestCard) {
	const currentIndex = allCards.indexOf(closestCard);
updateSlideCounter(currentIndex, allCards.length);
	
  const rect = closestCard.getBoundingClientRect();
  const top = rect.top - viewerRect.top + viewerScrollTop;
  const left = rect.left - viewerRect.left;

  highlightFrame.style.top = `${top}px`;
  highlightFrame.style.left = `${left}px`;
  highlightFrame.style.width = `${rect.width}px`;
  highlightFrame.style.height = `${rect.height}px`;

  highlightFrame.style.display = 'block'; // show again!
  lastHighlighted = closestCard;

  
}

}

function setViewerState(open) {
	
	if (open) {
  document.body.style.setProperty('overflow', 'hidden', 'important');
  document.documentElement.style.setProperty('overflow', 'hidden', 'important');
  
  if (open) {
  const savedIndex = parseInt(localStorage.getItem('lastCardIndex') || '0', 10);

  // Let viewer become visible, then trigger scrollToCard
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollToCard(savedIndex);
      updateHighlight();
    });
  });
  
  

}
  
} else {
  document.body.style.removeProperty('overflow');
  document.documentElement.style.removeProperty('overflow');
  


  
  document.getElementById('domainViewer').classList.remove('visible');

  
}


	
  viewer.classList.toggle('visible', open);

  
 
 console.log("Viewer open?", open);
console.log("HTML classes:", document.documentElement.className);
console.log("BODY classes:", document.body.className);
  
 
  localStorage.setItem('viewerOpen', open);
  hamburgerIcon.classList.toggle('hidden', open);
  closeIcon.classList.toggle('hidden', !open);

  if (open) {
    if (!history.state || !history.state.viewerOpen) {
      history.pushState({ viewerOpen: true }, '', location.href);
    }





    // ⏳ Delay slightly to allow DOM to paint
  setTimeout(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
		viewer.scrollTop += 1;
viewer.scrollTop -= 1;
      updateHighlight();
      highlightFrame.style.opacity = '0.5';
      highlightFrame.style.visibility = 'visible';
    });
  });
}, 200);



  } else {
    highlightFrame.style.display = 'none';
    lastHighlighted = null;
  }
}



openBtn.addEventListener('click', () => setViewerState(true));
closeBtn.addEventListener('click', () => setViewerState(false));
mobileCloseBtn?.addEventListener('click', () => setViewerState(false));

viewerToggle.addEventListener('click', () => {
  const isOpen = viewer.classList.contains('visible');
  
  setViewerState(!isOpen);
  
  setTimeout(() => {
  viewer.scrollTop = 0;
  updateHighlight();

}, 100);
});


/*
viewer.addEventListener('scroll', () => {
  requestAnimationFrame(updateHighlight);
});*/								//commented out 28/04/25 06:45
window.addEventListener('load', () => {
	viewer.classList.add('no-scroll');

	updateNavButtons();
  const shouldRestore = localStorage.getItem('viewerOpen') === 'true';

  if (shouldRestore) {
    viewer.classList.add('visible');
	
	 const lastIndex = parseInt(localStorage.getItem('lastCardIndex') || '0', 10);

  setTimeout(() => {
    scrollToCard(lastIndex); // ✅ Open on last viewed card
    updateHighlight();
  }, 100);
	setTimeout(() => {
		updateHighlight(); // ← force update in case scroll didn't hit 99%
  scrollToClosestCard();
   
}, 100);
    viewer.scrollTop = 0;
	
    hamburgerIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
    setTimeout(updateHighlight, 250);
  }

  // ✅ Always remove preload flag, even if viewer is closed
  setTimeout(() => {
    document.documentElement.classList.remove('preload-viewer');
	
  }, 300);
});



window.addEventListener('popstate', () => {
  if (viewer.classList.contains('visible')) {
    setViewerState(false);
    history.pushState(null, '', location.href); // Re-insert dummy to catch next back
  }
});


window.addEventListener('resize', () => {
  if (!highlightFrame) return;

  highlightFrame.style.display = 'none'; // hide during layout transition

  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    viewer.scrollTop += 1;
    viewer.scrollTop -= 1;

    requestAnimationFrame(() => {
      updateHighlight();
      highlightFrame.style.display = 'block';
    });
  }, 300);
});

document.querySelectorAll('.nextCardBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const currentCard = btn.closest('.domainCard');
    const nextCard = currentCard.nextElementSibling;
    if (nextCard && nextCard.classList.contains('domainCard')) {
      nextCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
																											
																								
document.querySelectorAll('.prevCardBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const currentCard = btn.closest('.domainCard');
    const prevCard = currentCard.previousElementSibling;
    if (prevCard && prevCard.classList.contains('domainCard')) {
      prevCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}); 


updateNavAlignment(currentCardIndex, document.querySelectorAll('.domainCard').length);
updateSlideCounter(currentCardIndex, document.querySelectorAll('.domainCard').length);


document.documentElement.classList.remove('preload-viewer');

























function setupContactModal() {


const contactModal = document.getElementById('contactModal');
const closeContact = document.getElementById('closeContact');
const form = document.getElementById('contactForm');
const responseDiv = document.getElementById('formResponse');
const submitBtn = form?.querySelector('button[type="submit"]');
const originalBtnText = submitBtn?.textContent;

/*
function openModal() {

  console.log('openModal triggered');
  if (!contactModal) return console.warn('❌ contactModal not found');
  document.body.style.overflow = 'hidden';
  
  
  contactModal.style.display = 'block';
  void contactModal.offsetWidth;
  contactModal.classList.add('active');
  if (form) {
    form.reset();
    form.style.display = 'flex';
  }
  if (responseDiv) responseDiv.style.display = 'none';
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
  
  
  // ✅ Auto-focus
  setTimeout(() => {
    document.querySelector('#contactForm input')?.focus();
  }, 300);
}

function closeModal() {
  if (!contactModal) return;
  document.body.style.overflow = '';
  contactModal.classList.remove('active');
 

  setTimeout(() => {
    contactModal.style.display = 'none';
	 document.querySelector('#contactModal .modal-content').innerHTML = originalModalContent;
  }, 350);
} */

function openModal() {
  console.log('openModal triggered');
  if (!contactModal) return console.warn('❌ contactModal not found');

  document.body.style.overflow = 'hidden';

  overlay?.classList.add('active');
  contactModal.style.display = 'block';
  void contactModal.offsetWidth;
  contactModal.classList.add('active');

  if (form) {
    form.reset();
    form.style.display = 'flex';
  }
  if (responseDiv) responseDiv.style.display = 'none';
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }

  setTimeout(() => {
    document.querySelector('#contactForm input')?.focus();
  }, 300);
}

function closeModal() {
  if (!contactModal) return;
  document.body.style.overflow = '';
  contactModal.classList.remove('active');
  overlay?.classList.remove('active'); // ← removes blur instantly

  setTimeout(() => {
    contactModal.style.display = 'none';
    document.querySelector('#contactModal .modal-content').innerHTML = originalModalContent;
  }, 350);
}


// ✅ Delegated listener
document.addEventListener('click', function (e) {
  if (e.target?.id === 'contactTrigger') {
    console.log('✅ Click on #contactTrigger detected');
    e.preventDefault();
    openModal();
  }
});

closeContact?.addEventListener('click', closeModal);

form?.addEventListener('submit', function (e) {
  e.preventDefault();
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  const formData = new FormData(form);
  const jsonData = {};
  formData.forEach((value, key) => jsonData[key] = value);
  
																		


  fetch(form.action, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonData)
  })
  .then(response => {
   if (response.ok) {
    const modalContent = document.querySelector('#contactModal .modal-content');
    if (modalContent) {
      modalContent.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px;">
          <img src="images/message-sent.png" alt="Message Sent" style="width: 96px; margin-bottom: 24px; animation: popin 0.4s ease;">
          <div style="font-size: 1.8rem; font-weight: bold; color: #00ff66; text-align: center;">Thanks! We'll be in touch shortly.</div>
          <span id="countdown" style="display:block; margin-top:40px; font-size:0.9rem; color: #aaa;">auto-closing in 4 seconds...</span>
        </div>
      `;
    }

      let secondsLeft = 4;
      const countdown = document.getElementById('countdown');
      const interval = setInterval(() => {
        secondsLeft--;
        if (secondsLeft > 0) {
          countdown.textContent = `auto-closing in ${secondsLeft} seconds...`;
        } else {
          clearInterval(interval);
          closeModal();
        }
      }, 1000);
    } else {
      responseDiv.textContent = '❌ Something went wrong. Please try again.';
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  })
  .catch(() => {
    responseDiv.textContent = '❌ Submission failed. Try again later.';
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  });
});


/*
document.addEventListener('keydown', (e) => {
  const keysToBlock = ['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown'];
  if (keysToBlock.includes(e.code)) {
    e.preventDefault();
  }
});*/


document.addEventListener('keydown', (e) => {
  const activeTag = document.activeElement.tagName;
  if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    document.querySelector('.nextCardBtn')?.click(); // ✅ use . for class
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    document.querySelector('.prevCardBtn')?.click();
  }
});





}


/** 15/11/25 **/

document.addEventListener('DOMContentLoaded', () => {
  const viewer = document.getElementById('domainViewer');
  if (!viewer) return;

  const cardChangeObserver = new MutationObserver(() => {
    const activeCard = document.querySelector('.domainCard.activeCard');
    if (!activeCard) return;

    const cardClass = [...activeCard.classList].find(cls => cls !== 'domainCard' && cls !== 'activeCard') || 'unknown_card';

    gtag('event', 'card_view', {
      event_category: 'card_interaction',
      event_label: cardClass,
    });
    console.log('📸 card_view:', cardClass);
  });

  cardChangeObserver.observe(viewer, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });
});

