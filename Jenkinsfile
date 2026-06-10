pipeline {
    agent any

    environment {
        IMAGE_NAME = "ayrus21/product-service"
        IMAGE_TAG = "v1"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Code checkout completed'
            }
        }

        stage('SonarQube Code Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                          -Dsonar.projectKey=flipkart-product-service \
                          -Dsonar.projectName=flipkart-product-service \
                          -Dsonar.sources=product-service
                        """
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG ./product-service'
            }
        }

        stage('Run Trivy Scan') {
            steps {
                sh 'trivy image $IMAGE_NAME:$IMAGE_TAG || true'
            }
        }

        stage('DockerHub Login & Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    docker push $IMAGE_NAME:$IMAGE_TAG
                    '''
                }
            }
        }
    }
}
