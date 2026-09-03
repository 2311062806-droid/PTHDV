package vn.edu.crs.course_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String secret;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {

                // Tạo SecretKey từ chuỗi secret
                SecretKey key = Keys.hmacShaKeyFor(
                        secret.getBytes(StandardCharsets.UTF_8)
                );

                // Xác thực JWT bằng JJWT 0.12.6
                Claims claims = Jwts.parser()
                        .verifyWith(key)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                // Lấy username từ JWT
                String username = claims.getSubject();

                // Lấy role từ JWT
                String role = claims.get("role", String.class);

                // Buổi 9: lấy userId từ JWT
                Long userId = claims.get("userId", Long.class);

                // Tạo Authentication
                // credentials = userId
                var authToken =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                userId,
                                List.of(
                                        new SimpleGrantedAuthority(
                                                "ROLE_" + role
                                        )
                                )
                        );

                // Đưa Authentication vào SecurityContext
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authToken);

                System.out.println("===== JWT SUCCESS =====");
                System.out.println("Request: "
                        + request.getMethod()
                        + " "
                        + request.getRequestURI());
                System.out.println("Username: " + username);
                System.out.println("UserId: " + userId);
                System.out.println("Role: " + role);
                System.out.println("Authority: ROLE_" + role);

            } catch (Exception e) {

                System.out.println("===== JWT ERROR =====");
                System.out.println("Request: "
                        + request.getMethod()
                        + " "
                        + request.getRequestURI());
                System.out.println("Error type: "
                        + e.getClass().getName());
                System.out.println("Error message: "
                        + e.getMessage());

                SecurityContextHolder.clearContext();
            }

        } else {

            System.out.println("===== NO JWT =====");
            System.out.println("Request: "
                    + request.getMethod()
                    + " "
                    + request.getRequestURI());
        }

        // Cho request đi tiếp tới Spring Security
        filterChain.doFilter(request, response);
    }
}