package co.edu.unbosque.model;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
    private String captchaResponse;
}
