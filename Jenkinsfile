pipeline {
    agent any

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
                sh 'docker build -t product-service:v1 ./product-service'
            }
        }

        stage('Load Image to KIND') {
            steps {
                sh 'kind load docker-image product-service:v1 --name flipkart-cluster'
            }
        }

        stage('Run Trivy Scan') {
            steps {
                sh 'trivy image product-service:v1 || true'
            }
        }

        stage('Run Container Test') {
            steps {
                sh '''
                docker rm -f product-service-test || true
                docker run -d -p 5001:5000 --name product-service-test product-service:v1
                sleep 5
                curl http://localhost:5001/products
                docker rm -f product-service-test
                '''
            }
        }

    }
}
