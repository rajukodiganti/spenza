pipeline {
    agent any

    environment {
        IMAGE_NAME = 'restaurant-website:latest'
        CONTAINER_NAME = 'restaurant-website-app'
        HOST_PORT = '8080'
        CONTAINER_PORT = '80'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Stage 1: Retrieving source code from repository...'
                checkout scm
            }
        }

        stage('Validate') {
            steps {
                echo 'Stage 2: Validating project structure and required files...'
                script {
                    def requiredFiles = [
                        'index.html',
                        'about.html',
                        'menu.html',
                        'reach-us.html',
                        'admin.html',
                        'style.css',
                        'script.js',
                        'Dockerfile'
                    ]

                    for (file in requiredFiles) {
                        if (!fileExists(file)) {
                            error "Validation Failure: Essential file '${file}' is missing from workspace."
                        }
                        echo "  [OK] Found: ${file}"
                    }
                }
            }
        }

        stage('Build') {
            steps {
                echo "Stage 3: Building Docker image '${IMAGE_NAME}'..."
                script {
                    if (isUnix()) {
                        sh "docker build -t ${IMAGE_NAME} ."
                    } else {
                        bat "docker build -t ${IMAGE_NAME} ."
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo "Stage 4: Deploying '${CONTAINER_NAME}' to port ${HOST_PORT}..."
                script {
                    if (isUnix()) {
                        sh """
                            # Stop and remove existing container if running
                            if [ "\$(docker ps -aq -f name=^/${CONTAINER_NAME}\$)" ]; then
                                echo "Stopping and removing existing container..."
                                docker stop ${CONTAINER_NAME} || true
                                docker rm -f ${CONTAINER_NAME} || true
                            fi
                            # Start container mapping host port 8080 to container port 80
                            docker run -d -p ${HOST_PORT}:${CONTAINER_PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}
                        """
                    } else {
                        bat """
                            @echo off
                            FOR /f "tokens=*" %%i IN ('docker ps -aq -f name=^/${CONTAINER_NAME}$') DO (
                                echo Stopping and removing existing container...
                                docker stop ${CONTAINER_NAME}
                                docker rm -f ${CONTAINER_NAME}
                            )
                            docker run -d -p ${HOST_PORT}:${CONTAINER_PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "=========================================================="
            echo "Deployment Completed Successfully!"
            echo "Access your website at: http://localhost:${HOST_PORT}"
            echo "=========================================================="
        }
        failure {
            echo "Pipeline run failed. Please check the stage console logs above."
        }
    }
}
