pipeline {
    agent any
    stages {
        stage('Run HoundDog.ai Scan') {
            environment {
                HOUNDDOG_API_KEY = credentials('hounddog-api-key')
            }
            steps {
                sh '''
                docker run --pull=always --rm -t -v .:/data --pull=always \
                    -e HOUNDDOG_API_KEY=$HOUNDDOG_API_KEY \
                    hounddogai/hounddog:staging hounddog scan \
                    --output-format=json > hounddog.json 2>&1 || { cat hounddog.json; exit 1; }
                '''
                sh 'cat hounddog.json'
            }
        }
    }
}
