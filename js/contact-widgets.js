(function () {
  var phone = "221757457002";
  var welcome = "Bonjour ! Je suis l’assistant virtuel d’InnovaDEV. Je peux vous renseigner sur nos services et vous aider à préparer votre projet.";
  var conversation = [];

  var wrapper = document.createElement("div");
  wrapper.className = "id-contact-widgets";
  wrapper.innerHTML =
    '<section class="id-chat-panel" id="id-chat-panel" aria-labelledby="id-chat-title" aria-hidden="true">' +
      '<header class="id-chat-header">' +
      '<div class="id-chat-avatar" aria-hidden="true"><i class="fas fa-robot"></i></div>' +
        '<div class="id-chat-heading"><h2 id="id-chat-title">Assistant InnovaDEV</h2><p><span class="id-chat-status"></span>Questions sur nos services</p></div>' +
        '<button class="id-chat-close" type="button" aria-label="Fermer l’assistant"><i class="fas fa-times"></i></button>' +
      '</header>' +
      '<div class="id-chat-messages" id="id-chat-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>' +
      '<div class="id-chat-suggestions" aria-label="Questions fréquentes">' +
        '<button type="button" data-question="Quels services proposez-vous ?">Vos services</button>' +
        '<button type="button" data-question="Comment obtenir un devis ?">Demander un devis</button>' +
      '</div>' +
      '<form class="id-chat-form" id="id-chat-form">' +
        '<label class="sr-only" for="id-chat-input">Votre message</label>' +
        '<input id="id-chat-input" name="message" type="text" maxlength="1200" autocomplete="off" placeholder="Écrivez votre message…" required>' +
        '<button type="submit" aria-label="Envoyer le message"><i class="fas fa-paper-plane"></i></button>' +
      '</form>' +
      '<p class="id-chat-note">Assistant IA avec Gemini. L’offre gratuite peut utiliser les messages pour améliorer les produits Google. Évitez les données sensibles.</p>' +
      '<a class="id-chat-whatsapp" href="https://wa.me/' + phone + '?text=' + encodeURIComponent("Bonjour InnovaDEV, j’aimerais parler de mon projet.") + '" target="_blank" rel="noopener"><i class="fab fa-whatsapp" aria-hidden="true"></i> Parler à l’équipe sur WhatsApp</a>' +
    '</section>' +
    '<div class="id-floating-actions">' +
      '<button class="id-assistant-toggle" type="button" aria-label="Ouvrir l’assistant IA" aria-controls="id-chat-panel" aria-expanded="false"><i class="fas fa-robot" aria-hidden="true"></i></button>' +
      '<a class="id-whatsapp-float" href="https://wa.me/' + phone + '?text=' + encodeURIComponent("Bonjour InnovaDEV, je souhaite en savoir plus sur vos services.") + '" target="_blank" rel="noopener" aria-label="Contacter InnovaDEV sur WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i></a>' +
    '</div>';

  document.body.appendChild(wrapper);

  var panel = wrapper.querySelector("#id-chat-panel");
  var toggle = wrapper.querySelector(".id-assistant-toggle");
  var close = wrapper.querySelector(".id-chat-close");
  var form = wrapper.querySelector("#id-chat-form");
  var input = wrapper.querySelector("#id-chat-input");
  var messages = wrapper.querySelector("#id-chat-messages");
  var suggestions = wrapper.querySelector(".id-chat-suggestions");
  var send = form.querySelector("button[type=submit]");

  function addMessage(text, who) {
    var item = document.createElement("p");
    item.className = "id-chat-message id-chat-message-" + who;
    item.textContent = text;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
    return item;
  }

  function setOpen(open) {
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      if (!messages.childElementCount) addMessage(welcome, "assistant");
      input.focus();
    } else {
      toggle.focus();
    }
  }

  async function ask(question) {
    var text = (question || "").trim();
    if (!text || send.disabled) return;

    addMessage(text, "user");
    conversation.push({ role: "user", content: text });
    input.value = "";
    send.disabled = true;
    send.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i>';
    var pending = addMessage("Je prépare une réponse…", "assistant id-chat-pending");
    var controller = new AbortController();
    var timeoutId = window.setTimeout(function () { controller.abort(); }, 15000);

    try {
      var response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation.slice(-8) }),
        signal: controller.signal,
      });
      var data = await response.json().catch(function () { return {}; });
      if (!response.ok) {
        var apiError = new Error(data.error || "Le service de réponse est temporairement indisponible.");
        apiError.fromApi = true;
        throw apiError;
      }
      pending.textContent = data.answer;
      conversation.push({ role: "assistant", content: data.answer });
    } catch (error) {
      if (error && error.fromApi) {
        pending.textContent = error.message;
      } else if (error && error.name === "AbortError") {
        pending.textContent = "La réponse prend trop de temps. Réessaie avec une question plus courte ou écris-nous sur WhatsApp.";
      } else {
        pending.textContent = "Je n’arrive pas à joindre le service de réponse. Vérifie que le serveur local Vercel est lancé, ou contacte-nous sur WhatsApp.";
      }
      pending.classList.add("id-chat-error");
    } finally {
      window.clearTimeout(timeoutId);
      pending.classList.remove("id-chat-pending");
      send.disabled = false;
      send.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i>';
      input.focus();
      messages.scrollTop = messages.scrollHeight;
    }
  }

  toggle.addEventListener("click", function () { setOpen(!panel.classList.contains("is-open")); });
  close.addEventListener("click", function () { setOpen(false); });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    ask(input.value);
  });
  suggestions.addEventListener("click", function (event) {
    var button = event.target.closest("[data-question]");
    if (!button) return;
    suggestions.hidden = true;
    ask(button.getAttribute("data-question"));
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && panel.classList.contains("is-open")) setOpen(false);
  });
})();
