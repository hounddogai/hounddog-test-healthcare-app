pipeline {
    agent any
    stages {
        stage('Run HoundDog.ai Scan') {
            environment {
                HOUNDDOG_API_KEY = credentials('hounddog-api-key')
            }
            steps {
                sh '''
                docker run --pull=always --rm -v .:/data \
                    -e HOUNDDOG_API_KEY=$HOUNDDOG_API_KEY \
                    hounddogai/hounddog:staging hounddog scan \
                    --output-format=json \
                    --output-filename=hounddog.json \
                    --debug
                '''
                sh 'cat hounddog.json'
            }
        }
    }
}
