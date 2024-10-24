package co.edu.unbosque.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CaptchaVerificationResponse {
    private boolean success;
    private String challengeTs;
    private String hostname;
    @JsonProperty("error-codes")
    private String[] errorCodes;
}
