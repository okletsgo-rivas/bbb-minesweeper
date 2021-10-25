<script>
let client = new Colyseus.Client('ws://localhost:2567');

client.joinOrCreate("chat_room").then(room => {
    room.state.messages.onAdd = (message, key) => {
        var p = document.createElement("p");
        p.innerText = message;
        let messages = document.querySelector("#messages");
        messages.appendChild(p);

        // Scroll to bottom of chat
        messages.scrollTo(0, messages.scrollHeight);
    }
    document.querySelector("#chat-input").onkeyup = (e) => {
        if (e.keyCode == 13) {
            // Do not send empty strings
            if (e.target.value.trim() !== '') {
                room.send("message", e.target.value);
            }

            // clear input
            e.target.value = "";
        }
    }
}).catch(e => {
    console.log("JOIN ERROR", e);
});
</script>

<div id="chat">
    <div id="messages"></div>
    <input type="text" id="chat-input" />
</div>

<style>
#chat {
    background-color: #2B2B2B;
    height: 240px;
    margin-top: auto;
    display: flex;
    flex-direction: column;
    border-top: 1px solid #1a1a1a;
}

#chat input {
    margin-top: auto;
    margin-left: 10px;
    margin-right: 10px;
    background-color: #222222;
    color: #ddca7e;
    border-radius: 5px;
}

#chat #messages {
    padding: 10px 20px 0 20px;
    overflow-y: scroll;
    color: #ddca7e;

    overflow-y: auto;
    scrollbar-width: auto;
    scrollbar-color: #1a1a1a;
}

/* ===== Scrollbar CSS ===== */
/* Chrome, Edge, and Safari */
#messages::-webkit-scrollbar {
    width: 16px;
}


#messages::-webkit-scrollbar-thumb {
    background-color: #212121;
    border-radius: 10px;
    border: 0px none #ffffff;
}

</style>