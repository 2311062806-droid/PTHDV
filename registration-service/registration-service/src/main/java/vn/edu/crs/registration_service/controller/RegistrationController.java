package vn.edu.crs.registration_service.controller;

import vn.edu.crs.registration_service.entity.Registration;
import vn.edu.crs.registration_service.service.RegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @GetMapping
    public List<Registration> getAll() {
        return registrationService.getAll();
    }

    // Buổi 9: lấy danh sách đăng ký của sinh viên đang đăng nhập
    @GetMapping("/my")
    public List<Registration> getMyRegistrations(
            Authentication authentication) {

        Long studentId =
                (Long) authentication.getCredentials();

        return registrationService.getMyRegistrations(studentId);
    }

    @GetMapping("/{id}")
    public Registration getById(@PathVariable Long id) {
        return registrationService.getById(id);
    }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody Registration registration) {

        try {
            Registration result =
                    registrationService.create(registration);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(result);

        } catch (RuntimeException e) {

            String message = e.getMessage();

            if (message != null &&
                    (message.equals("Sinh vien da dang ky mon hoc nay roi")
                            || message.equals("Mon hoc da het cho")
                            || message.equals("Mon hoc khong ton tai")
                            || message.equals("Khong the ket noi toi course-service"))) {

                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(Map.of("message", message));
            }

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", message));
        }
    }

    @PutMapping("/{id}")
    public Registration update(
            @PathVariable Long id,
            @RequestBody Registration registration) {

        return registrationService.update(id, registration);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {

        try {
            registrationService.delete(id);

            return ResponseEntity.ok(
                    Map.of("message", "Huy dang ky thanh cong")
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}