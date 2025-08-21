package vn.pvhg.backend.controller;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;
import vn.pvhg.backend.dto.message.MessageEvent;
import vn.pvhg.backend.dto.payload.MessagePayload;
import vn.pvhg.backend.enums.MessageEventType;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class MessageControllerTest {

    @LocalServerPort
    private int port;

    private WebSocketStompClient stompClient;
    private StompSession session;

    @BeforeEach
    void setup() throws Exception {
        // Use SockJS + WebSocket
        stompClient = new WebSocketStompClient(new SockJsClient(
                List.of(new WebSocketTransport(new StandardWebSocketClient()))
        ));
        stompClient.setMessageConverter(new MappingJackson2MessageConverter());

        String url = "ws://localhost:" + port + "/ws";
        session = stompClient.connectAsync(url, new StompSessionHandlerAdapter() {

        }).get(1, TimeUnit.SECONDS);
    }

    @AfterEach
    void tearDown() {
        if (session != null && session.isConnected()) {
            session.disconnect();
        }
    }

    @Test
    void testSendMessage() throws Exception {
        UUID chatId = UUID.randomUUID();
        CountDownLatch latch = new CountDownLatch(1);
        List<MessageEvent> messagesReceived = new ArrayList<>();

        session.subscribe("/topic/chat/" + chatId, new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return MessageEvent.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                messagesReceived.add((MessageEvent) payload);
                latch.countDown();
            }
        });

        MessagePayload payload = new MessagePayload("Hello world!", List.of());
        session.send("/app/chat.send." + chatId, payload);

        // Wait for the message to arrive
        assertTrue(latch.await(5, TimeUnit.SECONDS));
        assertFalse(messagesReceived.isEmpty());

        MessageEvent event = messagesReceived.get(0);
        assertEquals(MessageEventType.MESSAGE_SENT, event.eventType());
    }
}
