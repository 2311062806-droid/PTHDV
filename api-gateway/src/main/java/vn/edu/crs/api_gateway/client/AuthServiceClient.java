package vn.edu.crs.api_gateway.client;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

// purpose: goi sang auth-service (endpoint noi bo) de kiem tra API Key, dung WebClient
// vi api-gateway chay tren nen reactive (WebFlux) - khong dung RestTemplate (blocking)
@Component
public class AuthServiceClient {

    private final WebClient webClient;

    public AuthServiceClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:8081").build();
    }

    public Mono<Boolean> isValidForScope(String key, String scope) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/internal/api-keys/validate")
                        .queryParam("key", key)
                        .queryParam("scope", scope)
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .map(res -> Boolean.TRUE.equals(res.get("valid")))
                // Nguyen tac fail-safe: neu khong ket noi duoc auth-service,
                // tu choi request (coi nhu khong hop le), khong bao gio mac dinh cho phep
                .onErrorReturn(false);
    }
}
