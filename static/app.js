class Chatbox {
  constructor() {
    this.args = {
      chatBox: document.querySelector(".chatbox_support"),
      sendButton: document.querySelector(".send_button"),
      clearButton: document.querySelector(".clear_history"),
    };
    this.messages = [
      {
        name: "Dhruv",
        message: "Hi! My name is Dhruv. What would you like to know?",
      },
    ];
  }

  display() {
    const { chatBox, sendButton, clearButton } = this.args;
    sendButton.addEventListener("click", () => this.onSendButton(chatBox));
    clearButton.addEventListener("click", () =>
      this.deleteChatHistory(chatBox)
    );
    this.updateChatText(chatBox);
    const node = chatBox.querySelector("input");
    node.addEventListener("keyup", ({ key }) => {
      if (key === "Enter") {
        this.onSendButton(chatBox);
      }
    });
  }

  onSendButton(chatbox) {
    var textField = chatbox.querySelector("input");
    let text1 = textField.value;
    if (text1 === "") {
      return;
    }

    let msg1 = { name: "User", message: text1 };
    this.messages.push(msg1);

    fetch($SCRIPT_ROOT + '/predict', {
      method: 'POST',
      body: JSON.stringify({ message: text1 }),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((r) => r.json())
      .then((r) => {
        let msg2 = { name: "Dhruv", message: r.answer };
        this.messages.push(msg2);
        this.updateChatText(chatbox);
        textField.value = "";
      })
      .catch((error) => {
        console.error("Error:", error);
        this.updateChatText(chatbox);
        textField.value = "";
      });
  }

  updateChatText(chatbox) {
    var html = "";
    this.messages
      .slice()
      .reverse()
      .forEach(function (item) {
        if (item.name === "Dhruv") {
          html +=
            '<div class="messages_item messages_item-visitor">' +
            item.message +
            "</div>";
        } else {
          html +=
            '<div class="messages_item messages_item-operator">' +
            item.message +
            "</div>";
        }
      });
    const chatmessage = chatbox.querySelector(".chatbox_messages");
    chatmessage.innerHTML = html;
  }

  deleteChatHistory(chatbox) {
    this.messages.length = 0;
    this.updateChatText(chatbox);
  }
}

const chatbox = new Chatbox();
chatbox.display();
