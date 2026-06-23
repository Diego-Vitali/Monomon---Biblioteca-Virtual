FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copia os arquivos necessários e baixa as dependências (ajuda no cache do docker)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copia o código fonte e compila
COPY src ./src
RUN mvn clean package -DskipTests

# Estágio de execução
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Pega o .jar gerado do estágio anterior
COPY --from=build /app/target/biblioteca-0.0.1-SNAPSHOT.jar app.jar

# Expõe a porta 8080 do Spring Boot
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
