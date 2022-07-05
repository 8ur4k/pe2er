import logo from "./logo.svg";
import styles from "./App.module.css";
import { createSignal } from "solid-js";
import { onMount } from "solid-js";
import Peer from "peerjs";

enum CallStatus {
  IDLE,
  INCOMING_CALL,
  OUTGOING_CALL,
  ON_CALL,
}

function App() {
  let currentLinkInput: HTMLInputElement;
  let auido1: HTMLAudioElement;
  let ringtone: HTMLAudioElement;
  let amogus: HTMLAudioElement;

  const [callStatus, setCallStatus] = createSignal<CallStatus>(CallStatus.IDLE);

  function pezerle() {
    setCallStatus(CallStatus.ON_CALL);
  }

  const genRand = (len: number) => {
    return Math.random()
      .toString(36)
      .substring(2, len + 2);
  };

  onMount(async () => {
    const queryParams = new URLSearchParams(document.location.search);
    const callAdress = queryParams.get("to");
    const clientAddress = genRand(7);
    let baseUrl = "http://127.0.0.1:3000/";
    currentLinkInput.value = `${baseUrl}?to=${clientAddress}`;
    var peer = new Peer(clientAddress);

    peer.on("open", function (arg) {
      console.log("💥 ONLINE | " + callStatus());
    });

    peer.on("call", (call) => {
      setCallStatus(CallStatus.INCOMING_CALL);
      console.log("💥 INCOMING CALL | " + callStatus());
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          console.log("💥 ANSWERED CALL | " + callStatus());
          call.answer(stream); // Answer the call with an A/V stream.
          call.on("stream", (remoteStream) => {
            auido1.srcObject = remoteStream;
          });
        })
        .catch((err) => {
          console.error("Failed to get local stream", err);
        });
    });

    setTimeout(() => {
      if (callAdress) {
        console.log(`💥 OUTGOING CALL TO ${callAdress} | ` + callStatus());

        navigator.mediaDevices.getUserMedia({ audio: true }).then(
          (stream) => {
            console.log(`💥 STREAM | ` + callStatus());
            const call = peer.call(callAdress, stream);
            call.on("stream", (remoteStream) => {
              auido1.srcObject = remoteStream;
            });
          },
          (err) => {
            console.error("Failed to get local stream", err);
          }
        );
      }
    }, 1000);
  });

  return (
    <div class={styles.body}>
      <div class={styles.container}>
        <h1>PE2ER</h1>
        <p>Ne biçim konuşuyon pezer mezer.</p>
        <div class={styles.clientLogin}>
          <div class={styles.clienInput}>
            <input
              ref={currentLinkInput!}
              type="text"
              disabled
              placeholder="Connection link"
            />
          </div>
          <input class={styles.clientSubmitButton} type="button" value="Copy" />
        </div>
        {callStatus() == 1 && (
          <div class={styles.copyLink}>
            <input
              class={styles.copyLinkButton}
              type="button"
              onClick={() => pezerle()}
              value="P E Z E R L E!"
            />
            <audio
              ref={ringtone!}
              autoplay
              id="audio-ringtone"
              src="/src/assets/ringtone.mp3"
            ></audio>
          </div>
        )}
        <audio
          class={styles.dNone}
          ref={auido1!}
          controls
          autoplay
          id="audio-1"
        ></audio>
        {callStatus() == 3 && (
          <div>
            <audio ref={amogus!} autoplay src="/src/assets/amogus.mp3"></audio>
          </div>
        )}
      </div>
      <script src="https://unpkg.com/peerjs@1.4.6/dist/peerjs.min.js"></script>
      <script src="index.js"></script>
    </div>
  );
}

export default App;
