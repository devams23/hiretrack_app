pipeline {
    
    agent any
    
    environment {
        SAFE_BRANCH = "${env.BRANCH_NAME.replaceAll(/[^a-zA-Z0-9]/, '-')}".toLowerCase()
        APP_PORT = "${3000 + Math.abs(SAFE_BRANCH.hashCode() % 1000)}"
        IMAGE_NAME = "hiretrack-${SAFE_BRANCH}"
        
        // Pulling from Jenkins Credentials Provider
        // Replace 'supabase-url-id' and 'supabase-key-id' with your actual Jenkins Credential IDs
        S_URL = credentials('supabase-url-id')
        S_KEY = credentials('supabase-key-id')

        AZURE_VM_IP = credentials('azure-vm-ip-id')
    }

    stages {
        stage('Cleanup Old Build') {
            steps {
                sh "docker stop ${IMAGE_NAME} || true && docker rm ${IMAGE_NAME} || true"
            }
        }

        stage('Docker Build') {
            steps {
                // S_URL and S_KEY are now pulled securely from Jenkins
                sh """
                docker build \
                --build-arg SUPABASE_URL=${S_URL} \
                --build-arg SUPABASE_KEY=${S_KEY} \
                -t ${IMAGE_NAME} .
                """
            }
        }

        stage('Deploy') {
            steps {
                sh "docker run -d --name ${IMAGE_NAME} -p ${APP_PORT}:80 ${IMAGE_NAME}"
            }
        }
    }

    post {
        success {
            echo "Successfully deployed branch: ${env.BRANCH_NAME}"
            echo "VIEW APP AT: http://${AZURE_VM_IP}:${APP_PORT}"
        }
    }
}
