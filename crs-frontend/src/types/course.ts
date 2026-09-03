export interface Course {
  id: number;
  tenMonHoc: string;
  soTinChi: number;
  soChoToiDa: number;
  soChoConLai: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface CourseFormValues {
  tenMonHoc: string;
  soTinChi: string;
  soChoToiDa: string;
}

export const emptyCourseForm: CourseFormValues = {
  tenMonHoc: "",
  soTinChi: "",
  soChoToiDa: "",
};