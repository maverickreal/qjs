pipeline {
    agent {
        docker {
            image 'node:20-alpine'
            args '--network jsN'
        }
    }

    environment {
        // SonarQube server URL - update after setup
        SONAR_HOST_URL = 'http://sonarqube:9000'
        // Project key - matches SonarQube project
        SONAR_PROJECT_KEY = 'qjs'
        SONAR_PROJECT_NAME = 'qjs'
        // SonarQube auth token - create in Jenkins as Secret text with ID 'sonar-token'
        SONAR_TOKEN = credentials('SONAR_TOKEN')
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube-server') {
                    // Prepare Alpine for sonar-scanner (install deps)
                    sh 'apk add --no-cache curl unzip openjdk21-jre'
                    // Download and install SonarScanner CLI (generic/Java version — works on Alpine/musl)
                    sh '''
                        curl -sSLo /tmp/sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-6.2.1.4610.zip
                        unzip -q /tmp/sonar-scanner.zip -d /opt
                    '''
                    // Run analysis (using full path to avoid PATH issues in some envs)
                    sh '''
                        /opt/sonar-scanner-6.2.1.4610/bin/sonar-scanner \
                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                        -Dsonar.projectName="${SONAR_PROJECT_NAME}" \
                        -Dsonar.sources=src \
                        -Dsonar.host.url=${SONAR_HOST_URL} \
                        -Dsonar.token=${SONAR_TOKEN} \
                        -Dsonar.exclusions=node_modules/**,dist/** \
                        -Dsonar.typescript.tsconfigPath=tsconfig.json
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                // Wait for SonarQube quality gate (requires SonarQube plugin in Jenkins)
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed!'
            // Archive artifacts if needed
        }
        success {
            echo 'Build successful! Code quality passed SonarQube checks.'
        }
        failure {
            echo 'Build failed. Check SonarQube for issues.'
        }
    }
}
