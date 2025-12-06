# Stage 1: build with Maven + JDK 17
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# copy pom and download dependencies offline for speed
COPY pom.xml .
RUN mvn dependency:go-offline -B

# copy sources and build jar
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Eureka typically runs on 8761
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
