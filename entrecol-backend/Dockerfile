FROM openjdk:21-jdk-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y maven

COPY pom.xml ./

COPY src ./src

EXPOSE 8080

CMD ["./mvnw", "spring-boot:run", "-Dspring-boot.run.jvmArguments='-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005'"]
