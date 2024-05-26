pipeline {
    agent any
    stages {
        stage('Run HoundDog.ai Scan') {
            environment {
                HOUNDDOG_API_KEY = credentials('hounddog-api-key')
            }
            steps {
                sh '''
                docker run --pull=always --rm -v .:/scanpath hounddogai/scanner:staging \
                    -e HOUNDDOG_API_KEY=$HOUNDDOG_API_KEY \
                    hounddog scan \
                    --output-format=json \
                    --output-filename=hounddog.json \
                    --debug
                '''
                sh 'cat hounddog.json'
            }
        }
    }
}
