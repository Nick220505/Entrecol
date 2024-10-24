FROM eclipse-temurin:21-jdk-jammy

WORKDIR /usr/src/app

COPY pom.xml .
COPY src src/

CMD ["./mvnw", "spring-boot:run", "-Dspring-boot.run.jvmArguments='-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:8000'"]
