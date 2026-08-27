package vn.edu.crs.registration_service.service;

import vn.edu.crs.registration_service.entity.Registration;
import vn.edu.crs.registration_service.repository.RegistrationRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final RestClient restClient;

    public RegistrationService(
            RegistrationRepository registrationRepository,
            @Value("${course-service.base-url}") String courseServiceBaseUrl) {

        this.registrationRepository = registrationRepository;

        this.restClient = RestClient.builder()
                .baseUrl(courseServiceBaseUrl)
                .build();
    }

    public List<Registration> getAll() {
        return registrationRepository.findAll();
    }

    public Registration getById(Long id) {
        return registrationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Khong tim thay dang ky id = " + id
                        )
                );
    }

    private boolean alreadyRegistered(Long studentId, Long courseId) {
        return registrationRepository
                .existsByStudentIdAndCourseIdAndTrangThai(
                        studentId,
                        courseId,
                        "DA_DANG_KY"
                );
    }

    public Registration create(Registration registration) {

        Long studentId = registration.getStudentId();
        Long courseId = registration.getCourseId();

        if (alreadyRegistered(studentId, courseId)) {
            throw new RuntimeException(
                    "Sinh vien da dang ky mon hoc nay roi"
            );
        }

        try {

            restClient.patch()
                    .uri(
                            "/internal/courses/{id}/reserve-seat",
                            courseId
                    )
                    .retrieve()
                    .body(String.class);

        } catch (Exception e) {

            String message = e.getMessage();

            if (message != null && message.contains("404")) {
                throw new RuntimeException(
                        "Mon hoc khong ton tai"
                );
            }

            if (message != null && message.contains("409")) {
                throw new RuntimeException(
                        "Mon hoc da het cho"
                );
            }

            throw new RuntimeException(
                    "Khong the ket noi toi course-service"
            );
        }

        registration.setTrangThai("DA_DANG_KY");

        registration.setNgayDangKy(LocalDateTime.now());

        return registrationRepository.save(registration);
    }

    public Registration update(
            Long id,
            Registration registration) {

        Registration existing =
                registrationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Khong tim thay dang ky id = " + id
                                )
                        );

        existing.setStudentId(
                registration.getStudentId()
        );

        existing.setCourseId(
                registration.getCourseId()
        );

        return registrationRepository.save(existing);
    }

    public void delete(Long id) {

        Registration existing =
                registrationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Khong tim thay dang ky id = " + id
                                )
                        );

        Long courseId = existing.getCourseId();

        try {

            restClient.patch()
                    .uri(
                            "/internal/courses/{id}/release-seat",
                            courseId
                    )
                    .retrieve()
                    .body(String.class);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Khong the ket noi toi course-service"
            );
        }

        existing.setTrangThai("DA_HUY");

        registrationRepository.save(existing);
    }


}
