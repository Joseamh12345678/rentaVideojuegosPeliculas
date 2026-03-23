FROM python:3.11

# Instalar dependencias del sistema + ODBC
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    unixodbc \
    unixodbc-dev \
    curl \
    apt-transport-https \
    gnupg

# Instalar driver de SQL Server (versión moderna sin apt-key)
RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /usr/share/keyrings/microsoft.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft.gpg] https://packages.microsoft.com/debian/11/prod bullseye main" > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql17

# Carpeta de trabajo
WORKDIR /app

# Copiar archivos
COPY . .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Ejecutar app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]