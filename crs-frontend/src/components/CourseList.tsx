import type { Course } from "../types/course";
import type { LoadState } from "../api/useCourses";

interface CourseListProps {
  courses: Course[];
  state: LoadState;
  errorMessage: string;
  onRetry: () => void;

  // Lab 8: optional
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;

  // Lab 9: đăng ký môn học
  onRegister?: (course: Course) => void;
  registeringId?: number | null;
}

export default function CourseList({
  courses,
  state,
  errorMessage,
  onRetry,
  onEdit,
  onDelete,
  onRegister,
  registeringId,
}: CourseListProps) {
  if (state === "loading") {
    return <p>Đang tải danh sách môn học...</p>;
  }

  if (state === "error") {
    return (
      <div style={{ color: "#b91c1c" }}>
        <p>{errorMessage}</p>
        <button onClick={onRetry}>Thử lại</button>
      </div>
    );
  }

  if (state === "empty") {
    return (
      <p>Không tìm thấy môn học nào phù hợp.</p>
    );
  }

  // Chỉ hiện cột Thao tác khi có onEdit hoặc onDelete
  const showActions = !!onEdit || !!onDelete;

  // Lab 9: hiện cột Đăng ký khi có onRegister
  const showRegister = !!onRegister;

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr
          style={{
            textAlign: "left",
            borderBottom: "2px solid #333",
          }}
        >
          <th>Tên môn học</th>
          <th>Số tín chỉ</th>
          <th>Số chỗ còn lại</th>

          {showRegister && <th>Đăng ký</th>}

          {showActions && <th>Thao tác</th>}
        </tr>
      </thead>

      <tbody>
        {courses.map((course) => (
          <tr
            key={course.id}
            style={{
              borderBottom: "1px solid #eee",
            }}
          >
            <td>{course.tenMonHoc}</td>

            <td>{course.soTinChi}</td>

            <td
              style={{
                color:
                  course.soChoConLai === 0
                    ? "#b91c1c"
                    : "inherit",
              }}
            >
              {course.soChoConLai} / {course.soChoToiDa}
            </td>

            {showRegister && (
              <td>
                <button
                  onClick={() => onRegister(course)}
                  disabled={
                    course.soChoConLai === 0 ||
                    registeringId === course.id
                  }
                >
                  {registeringId === course.id
                    ? "Đang đăng ký..."
                    : course.soChoConLai === 0
                      ? "Hết chỗ"
                      : "Đăng ký"}
                </button>
              </td>
            )}

            {showActions && (
              <td>
                {onEdit && (
                  <button
                    onClick={() => onEdit(course)}
                  >
                    Sửa
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={() => onDelete(course)}
                    style={{
                      marginLeft: 8,
                      color: "#b91c1c",
                    }}
                  >
                    Xóa
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}