package com.heart.model.dto;

public record ApiResponse<T>(
    boolean success,
    String version,
    String updatedAt,
    T data,
    String error
) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, "1.0", "2026-06-03", data, null);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, "1.0", "2026-06-03", null, message);
    }
}
