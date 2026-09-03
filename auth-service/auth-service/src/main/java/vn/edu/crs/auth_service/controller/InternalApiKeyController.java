package vn.edu.crs.auth_service.controller;

import vn.edu.crs.auth_service.service.ApiKeyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// purpose: endpoint noi bo de api-gateway kiem tra 1 API Key co hop le cho 1 scope khong.
// Khong duoc khai trong routes cua Gateway, nen Frontend/doi tac ngoai khong goi truc tiep duoc
// - chi api-gateway (qua mang noi bo localhost) moi goi toi.
@RestController
@RequestMapping("/internal/api-keys")
@RequiredArgsConstructor
public class InternalApiKeyController {

    private final ApiKeyService apiKeyService;

    @GetMapping("/validate")
    public Map<String, Object> validate(
            @RequestParam String key,
            @RequestParam String scope) {

        boolean valid = apiKeyService.isValidForScope(key, scope);
        return Map.of("valid", valid);
    }
}
