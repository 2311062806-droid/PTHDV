package vn.edu.crs.course_service.config;

import vn.edu.crs.course_service.security.JwtAuthFilter;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http) throws Exception {

        http
                // Không dùng CSRF vì đây là REST API
                .csrf(csrf -> csrf.disable())

                // JWT nên dùng Stateless
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Internal API
                        .requestMatchers("/internal/**")
                        .permitAll()

                        // GET courses public
                        .requestMatchers(
                                HttpMethod.GET,
                                "/courses/**"
                        )
                        .permitAll()

                        // POST courses cần ADMIN
                        .requestMatchers(
                                HttpMethod.POST,
                                "/courses/**"
                        )
                        .hasRole("ADMIN")

                        // PUT courses cần ADMIN
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/courses/**"
                        )
                        .hasRole("ADMIN")

                        // DELETE courses cần ADMIN
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/courses/**"
                        )
                        .hasRole("ADMIN")

                        // Các request khác phải đăng nhập
                        .anyRequest()
                        .authenticated()
                )

                // Chạy JwtAuthFilter trước filter đăng nhập mặc định
                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}