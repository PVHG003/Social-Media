package vn.pvhg.backend.filter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.security.UserDetailsServiceImpl;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtChannelInterceptor implements ChannelInterceptor {
    private final JwtDecoder jwtDecoder;
    private final UserDetailsServiceImpl userDetailsServiceImpl;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authorization = accessor.getFirstNativeHeader("Authorization");

            // fallback to query param for SockJS
            if (authorization == null) {
                String token = accessor.getSessionAttributes() != null
                        ? (String) accessor.getSessionAttributes().get("token")
                        : null;
                authorization = token != null ? "Bearer " + token : null;
            }

            if (authorization != null && authorization.startsWith("Bearer ")) {
                String token = authorization.substring("Bearer ".length());
                Jwt jwt = jwtDecoder.decode(token);
                String subject = jwt.getSubject();
                UserDetailsImpl user = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(subject);

                List<String> authorities = jwt.getClaimAsStringList("authorities");
                List<GrantedAuthority> grantedAuthorities = authorities.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        grantedAuthorities);
                accessor.setUser(authentication);
                log.info("Principal: {}", authentication.getName());
            }
        }

        return message;
    }
}