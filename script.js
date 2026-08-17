
  // ---- Chat widget ----
  // This runs fully client-side with rule-based replies out of the box.
  // To connect a real AI agent, point WEBHOOK_URL at an n8n webhook (or any endpoint)
  // that accepts { message } and returns { reply } — then set USE_WEBHOOK to true.
  const WEBHOOK_URL = ""; // e.g. "https://your-n8n-instance.com/webhook/dammybiz-chat"
  const USE_WEBHOOK = false;

  const chatToggle = document.getElementById('chatToggle');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');

  chatToggle.addEventListener('click', () => {
    chatPanel.classList.toggle('open');
    chatToggle.querySelector('.badge-ping').style.display = 'none';
    if(chatPanel.classList.contains('open')) chatInput.focus();
  });
  chatClose.addEventListener('click', () => chatPanel.classList.remove('open'));

  function addMsg(text, who){
    const div = document.createElement('div');
    div.className = 'msg ' + who;
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    return div;
  }

  function showTyping(){
    const div = document.createElement('div');
    div.className = 'msg bot typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    return div;
  }

  // Simple rule-based fallback so the widget works with zero setup.
  function localReply(message){
    const m = message.toLowerCase();
    if(m.includes('price') || m.includes('cost') || m.includes('much')){
      return "Pricing depends on scope — a single automation flow vs a full email system cost differently. Tell me a bit about your business and I'll point you in the right direction, or message Dammy directly on WhatsApp for an exact quote.";
    }
    if(m.includes('platform') || m.includes('klaviyo') || m.includes('mailerlite') || m.includes('beehiiv') || m.includes('brevo')){
      return "Dammy works across MailerLite, Klaviyo, Beehiiv and Brevo — setup from scratch or inside your existing account.";
    }
    if(m.includes('time') || m.includes('long') || m.includes('days') || m.includes('week')){
      return "A single flow (like a welcome series) usually takes 3–5 days. A full system with multiple flows and segmentation runs 1–2 weeks.";
    }
    if(m.includes('whatsapp') || m.includes('call') || m.includes('talk')){
      return "You can reach Dammy directly here: wa.me/2349135848052";
    }
    if(m.includes('hi') || m.includes('hello') || m.includes('hey')){
      return "Hey! What are you looking to fix or build with your email list — growth, automation, or a full setup?";
    }
    return "Good question — for a precise answer, Dammy's best placed to help directly. Want me to send you to WhatsApp, or you can drop your email and he'll follow up?";
  }

  async function sendMessage(){
    const text = chatInput.value.trim();
    if(!text) return;
    addMsg(text, 'user');
    chatInput.value = '';
    const typingEl = showTyping();

    if(USE_WEBHOOK && WEBHOOK_URL){
      try{
        const res = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        typingEl.remove();
        addMsg(data.reply || "Sorry, I didn't catch that — try WhatsApp for a direct answer.", 'bot');
      }catch(err){
        typingEl.remove();
        addMsg("Couldn't reach the assistant right now — message Dammy on WhatsApp instead.", 'bot');
      }
    } else {
      setTimeout(() => {
        typingEl.remove();
        addMsg(localReply(text), 'bot');
      }, 650);
    }
  }

  chatSend.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', e => { if(e.key === 'Enter') sendMessage(); });



  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
