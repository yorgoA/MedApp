package com.medapp.dto;

import com.medapp.entity.User;

public class LoginResponse {

    private Long id;
    private String email;
    private String name;
    private String role;
    private String token;

    public LoginResponse(User user, String token) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.role = user.getRole().name();
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public String getToken() {
        return token;
    }
}
