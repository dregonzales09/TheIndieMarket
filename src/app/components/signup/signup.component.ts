import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  passwordMismatch = false;
  isAnalyzing = false;

  constructor(private router: Router) {}

  onSubmit(form: any) {
    if (this.user.password !== this.user.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }
    
    this.passwordMismatch = false;
    
    if (form.valid && !this.isAnalyzing) {
      this.isAnalyzing = true;
      
      const audio = new Audio('/assets/loginsfx.mp3');
      audio.volume = 0.8;
      
      audio.onended = () => {
        this.router.navigate(['/games']);
      };
      
      // In case playback fails (e.g. browser policies block it), fallback timeout
      audio.play().catch(e => {
        setTimeout(() => this.router.navigate(['/games']), 2000);
      });
    }
  }
}
