<<<<<<<< HEAD:backend/src/main/java/vn/pvhg/backend/security/impl/UserDetailsServiceImpl.java
package vn.pvhg.backend.security.impl;
========
package vn.pvhg.backend.security.hung;
>>>>>>>> feature/chat-function:backend/src/main/java/vn/pvhg/backend/security/hung/UserDetailsServiceImpl.java

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
<<<<<<<< HEAD:backend/src/main/java/vn/pvhg/backend/security/impl/UserDetailsServiceImpl.java
import vn.pvhg.backend.exception.ResourceNotFoundException;
import vn.pvhg.backend.authentication.model.User;
import vn.pvhg.backend.authentication.repository.UserRepository;
========
import vn.pvhg.backend.auth.hung.model.User;
import vn.pvhg.backend.auth.hung.repository.UserRepository;
>>>>>>>> feature/chat-function:backend/src/main/java/vn/pvhg/backend/security/hung/UserDetailsServiceImpl.java

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));

        return UserDetailsImpl.build(user);
    }
}
