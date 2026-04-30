<template>
<div class="body">
    <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
    </div>
    
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-6 col-md-8 px-0">
                    <div class="login-header" style="border-radius: 50%; width: 180px; height: 180px; margin: 0 auto;">
                        <div class="logo">
                            <div class="logo-icon">
                                <i class="fas fa-graduation-cap"></i>
                            </div>
                        </div>
                    </div>
                    <div class="py-4 text-center">
                    	<h1 style="font-weight: 900; opacity: 0.7;">ProAcademico</h1>
                        <p style="opacity: 0.7;">Sistema de Gestão Escolar</p>
                    </div>

                <div class="text-center mt-4 text-muted" style="opacity: 0.7;">
                    <h5>www.proacademico.it.ao</h5>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default { 
  data() {
    return {
      see: false,
      input_type: "password",
      login: "",
      senha: "",
      erro: null,
      loader: false,
    };
  },

  mounted() {
        setTimeout(() => {
            this.$router.push("login")
        }, 3000)
  }
 }
</script>

<style scoped>
    .body {
        font-family: 'Poppins', sans-serif;
        /* background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%); */
        min-height: 100vh;
        display: flex;
        overflow-x: hidden;
        padding-top: 150px;
    }

.login-header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.login-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path fill="rgba(255,255,255,0.1)" d="M0,0 L100,0 L100,100 Q50,80 0,100 L0,0 Z"></path></svg>');
  background-size: 100% 100%;
  opacity: 0.3;
}

.logo {
  font-weight: 600;
  font-size: 1.8rem;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
}

.logo-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

    .login-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .login-container:hover {
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .login-header {
            background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
            color: white;
            text-align: center;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .login-header::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path fill="rgba(255,255,255,0.1)" d="M0,0 L100,0 L100,100 Q50,80 0,100 L0,0 Z"></path></svg>');
            background-size: 100% 100%;
            opacity: 0.5;
        }
        
        .logo {
            font-weight: 600;
            font-size: 2rem;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 0.5rem;
        }
        
        .logo-icon {
            font-size: 2.2rem;
        }
        
        .login-body {
            padding: 2.5rem;
        }
        
        .form-control {
            border-radius: 10px;
            padding-top: 20px !important;
            border: 2px solid #e9ecef;
            transition: all 0.3s;
        }
        
        .form-control:focus {
            /* border-color: var(--accent-color); */
            box-shadow: 0 0 0 0.25rem rgba(76, 201, 240, 0.25);
        }
        
        .input-group-text {
            background: transparent;
            border-right: none;
        }
        
        .form-floating > .form-control:not(:placeholder-shown) ~ label {
            color: var(--primary-color);
        }
        
        .btn-login {
            background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
            border: none;
            border-radius: 10px;
            padding: 12px;
            font-weight: 500;
            letter-spacing: 0.5px;
            transition: all 0.3s;
            width: 100%;
        }
        
        .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(67, 97, 238, 0.4);
        }
        
        .divider {
            display: flex;
            align-items: center;
            margin: 1.5rem 0;
            color: #adb5bd;
        }
        
        .divider::before, .divider::after {
            content: "";
            flex: 1;
            border-bottom: 1px solid #dee2e6;
        }
        
        .divider::before {
            margin-right: 1rem;
        }
        
        .divider::after {
            margin-left: 1rem;
        }
        
        .social-login .btn {
            border-radius: 10px;
            padding: 10px;
            font-size: 0.9rem;
        }
        
        .floating-shapes {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
            overflow: hidden;
        }
        
        .shape {
            position: absolute;
            opacity: 0.1;
            border-radius: 50%;
        }
        
        .shape-1 {
            width: 300px;
            height: 300px;
            background: var(--primary-color);
            top: -100px;
            right: -100px;
        }
        
        .shape-2 {
            width: 200px;
            height: 200px;
            background: var(--accent-color);
            bottom: -50px;
            left: -50px;
        }
        
        .login-footer {
  text-align: center;
}

.login-footer a {
  color: #6c757d;
  text-decoration: none;
  transition: color 0.2s;
}

.login-footer a:hover {
  color: var(--primary-color);
}

.copyright {
  color: #6c757d;
  font-size: 0.85rem;
  opacity: 0.8;
}

        @media (max-width: 768px) {
            .login-container {
                margin: 1rem;
            }
            
            .login-body {
                padding: 1.5rem;
            }
        }

    /* Wave Loader */
    .wave-loader {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        height: 20px;
    }

    .wave-bar {
    width: 3px;
    height: 15px;
    background-color: #e9e9e9;
    border-radius: 4px;
    animation: wave-animation 1.2s ease-in-out infinite;
    }

    .wave-bar:nth-child(1) {
    animation-delay: 0s;
    }
    .wave-bar:nth-child(2) {
    animation-delay: 0.2s;
    }
    .wave-bar:nth-child(3) {
    animation-delay: 0.4s;
    }

    @keyframes wave-animation {
    0%, 100% {
        transform: scaleY(1);
    }
    50% {
        transform: scaleY(0.3);
    }
    }
</style>