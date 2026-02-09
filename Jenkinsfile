pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build & Deploy') {
      steps {
        sh '''
          docker compose down
          docker compose up -d --build
          docker compose ps
        '''
      }
    }

    stage('Smoke Test') {
      steps {
        sh '''
          sleep 5
          curl -fsS http://localhost:9090 > /dev/null
        '''
      }
    }
  }

  post {
    always {
      sh 'docker compose logs --tail=200 || true'
      cleanWs()
    }
  }
}

