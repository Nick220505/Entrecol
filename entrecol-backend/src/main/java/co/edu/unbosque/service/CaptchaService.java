package co.edu.unbosque.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import co.edu.unbosque.model.CaptchaVerificationResponse;

@Service
public class CaptchaService {
    private final String secretKey = "6LfRG2sqAAAAAJCKlbPhBCbCrYscWLpFnt0-BC75";
    private final RestTemplate restTemplate = new RestTemplate();

    public boolean verifyCaptcha(String captchaResponse) {
        String url = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + captchaResponse;
        CaptchaVerificationResponse response = restTemplate.postForObject(url, null, CaptchaVerificationResponse.class);
        return response != null && response.isSuccess();
    }
}
