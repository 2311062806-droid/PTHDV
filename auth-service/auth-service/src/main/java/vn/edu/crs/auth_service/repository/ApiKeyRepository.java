package vn.edu.crs.auth_service.repository;

import vn.edu.crs.auth_service.entity.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// purpose: repository JPA cho ApiKey
public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {
    Optional<ApiKey> findByKeyValue(String keyValue);
}
