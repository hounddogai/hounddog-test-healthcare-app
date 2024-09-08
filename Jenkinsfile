pipeline {
    agent any
    stages {
        stage('Display HoundDog.ai Definitions') {
            steps {
                sh '''
                docker run --rm -t -v .:/data --pull=always \
                    hounddogai/hounddog:staging hounddog definitions
                '''
                sh '''
                docker run --rm -t -v .:/data --pull=always \
                    hounddogai/hounddog:staging hounddog scan --output-format=json
                '''
            }
        }
        stage('Run HoundDog.ai Scan') {
            environment {
                HOUNDDOG_API_KEY = credentials('hounddog-api-key')
            }
            steps {
                sh '''
                docker run --rm -t -v .:/data --pull=always -e HOUNDDOG_API_KEY=$HOUNDDOG_API_KEY \
                    hounddogai/hounddog:staging hounddog scan
                '''
                sh '''
                docker run --rm -t -v .:/data --pull=always -e HOUNDDOG_API_KEY=$HOUNDDOG_API_KEY \
                    hounddogai/hounddog:staging hounddog scan --output-format=json
                '''
            }
        }
    }
}
