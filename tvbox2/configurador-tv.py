#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TV UBS Guarapuava - Configurador Automático
Aplicativo para facilitar a instalação nas TVs dos postos
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import webbrowser
import os
import sys
from pathlib import Path
import json

class TVConfiguratorApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("🏥 TV UBS Guarapuava - Configurador")
        self.root.geometry("600x500")
        self.root.configure(bg='#2c3e50')
        
        # Variáveis
        self.server_ip = tk.StringVar(value="localhost")
        self.posto_code = tk.StringVar()
        self.selected_posto = tk.StringVar()
        
        # Lista de postos
        self.postos = {
            "UBS Centro Guarapuava": "ubs-centro-guarapuava",
            "UBS Bom Jesus": "ubs-bom-jesus", 
            "UBS Primavera": "ubs-primavera",
            "UBS Jardim América": "ubs-jardim-america",
            "UBS Santa Cruz": "ubs-santa-cruz",
            "UBS Vila Esperança": "ubs-vila-esperanca",
            "UBS Coroados": "ubs-coroados",
            "Personalizado": "custom"
        }
        
        self.create_widgets()
        self.load_config()
        
    def create_widgets(self):
        # Título
        title_frame = tk.Frame(self.root, bg='#2c3e50')
        title_frame.pack(pady=20)
        
        title_label = tk.Label(title_frame, 
                              text="🏥 TV UBS GUARAPUAVA", 
                              font=('Arial', 24, 'bold'),
                              fg='#3498db', bg='#2c3e50')
        title_label.pack()
        
        subtitle_label = tk.Label(title_frame,
                                 text="Configurador Automático para TV Box",
                                 font=('Arial', 12),
                                 fg='#ecf0f1', bg='#2c3e50')
        subtitle_label.pack()
        
        # Frame principal
        main_frame = tk.Frame(self.root, bg='#34495e', relief='raised', bd=2)
        main_frame.pack(padx=20, pady=20, fill='both', expand=True)
        
        # Configuração do servidor
        server_frame = tk.LabelFrame(main_frame, text="📡 Configuração do Servidor",
                                   font=('Arial', 12, 'bold'),
                                   fg='#3498db', bg='#34495e')
        server_frame.pack(padx=20, pady=10, fill='x')
        
        tk.Label(server_frame, text="IP/Domínio do Servidor:",
                font=('Arial', 10), fg='#ecf0f1', bg='#34495e').pack(anchor='w', padx=10, pady=5)
        
        server_entry = tk.Entry(server_frame, textvariable=self.server_ip,
                               font=('Arial', 12), width=30)
        server_entry.pack(padx=10, pady=5)
        
        # Seleção do posto
        posto_frame = tk.LabelFrame(main_frame, text="🏥 Seleção do Posto de Saúde",
                                   font=('Arial', 12, 'bold'),
                                   fg='#3498db', bg='#34495e')
        posto_frame.pack(padx=20, pady=10, fill='x')
        
        posto_combo = ttk.Combobox(posto_frame, textvariable=self.selected_posto,
                                  values=list(self.postos.keys()),
                                  font=('Arial', 12), state='readonly')
        posto_combo.pack(padx=10, pady=10, fill='x')
        posto_combo.bind('<<ComboboxSelected>>', self.on_posto_selected)
        
        # Campo personalizado (inicialmente oculto)
        self.custom_frame = tk.Frame(posto_frame, bg='#34495e')
        
        tk.Label(self.custom_frame, text="Código personalizado:",
                font=('Arial', 10), fg='#ecf0f1', bg='#34495e').pack(anchor='w')
        
        self.custom_entry = tk.Entry(self.custom_frame, textvariable=self.posto_code,
                                    font=('Arial', 12), width=30)
        self.custom_entry.pack(pady=5)
        
        # Preview da URL
        preview_frame = tk.LabelFrame(main_frame, text="🔗 URL Gerada",
                                     font=('Arial', 12, 'bold'),
                                     fg='#3498db', bg='#34495e')
        preview_frame.pack(padx=20, pady=10, fill='x')
        
        self.url_label = tk.Label(preview_frame, text="",
                                 font=('Arial', 10), fg='#2ecc71', bg='#34495e',
                                 wraplength=500)
        self.url_label.pack(padx=10, pady=10)
        
        # Botões
        button_frame = tk.Frame(main_frame, bg='#34495e')
        button_frame.pack(pady=20)
        
        test_btn = tk.Button(button_frame, text="🧪 Testar no Navegador",
                           command=self.test_browser,
                           bg='#f39c12', fg='white', font=('Arial', 12, 'bold'),
                           padx=20, pady=10)
        test_btn.pack(side='left', padx=10)
        
        install_btn = tk.Button(button_frame, text="⚙️ Instalar na TV",
                              command=self.install_tv,
                              bg='#27ae60', fg='white', font=('Arial', 12, 'bold'),
                              padx=20, pady=10)
        install_btn.pack(side='left', padx=10)
        
        kiosk_btn = tk.Button(button_frame, text="📺 Modo Quiosque",
                            command=self.open_kiosk,
                            bg='#8e44ad', fg='white', font=('Arial', 12, 'bold'),
                            padx=20, pady=10)
        kiosk_btn.pack(side='left', padx=10)
        
        # Bind para atualizar URL em tempo real
        self.server_ip.trace('w', self.update_url)
        self.posto_code.trace('w', self.update_url)
        
        # Atualizar URL inicial
        self.update_url()
        
    def on_posto_selected(self, event=None):
        selected = self.selected_posto.get()
        if selected == "Personalizado":
            self.custom_frame.pack(padx=10, pady=5, fill='x')
            self.posto_code.set("")
        else:
            self.custom_frame.pack_forget()
            if selected in self.postos:
                self.posto_code.set(self.postos[selected])
        
        self.update_url()
    
    def update_url(self, *args):
        server = self.server_ip.get() or "localhost"
        posto = self.posto_code.get()
        
        if posto:
            url = f"http://{server}:3001/tv-posto.html?posto={posto}"
            self.url_label.config(text=url)
        else:
            self.url_label.config(text="Selecione um posto para gerar a URL")
    
    def test_browser(self):
        url = self.url_label.cget("text")
        if url and url.startswith("http"):
            webbrowser.open(url)
            messagebox.showinfo("Teste", f"Abrindo no navegador:\n{url}")
        else:
            messagebox.showerror("Erro", "Configure o servidor e posto primeiro!")
    
    def install_tv(self):
        url = self.url_label.cget("text")
        posto = self.posto_code.get()
        
        if not url or not url.startswith("http"):
            messagebox.showerror("Erro", "Configure o servidor e posto primeiro!")
            return
        
        try:
            # Criar arquivo HTML local
            html_content = f"""<!DOCTYPE html>
<html>
<head>
    <title>TV UBS - {posto}</title>
    <meta http-equiv="refresh" content="1;url={url}">
    <style>
        body {{
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            margin: 0;
        }}
        .logo {{ font-size: 80px; margin-bottom: 20px; }}
        h1 {{ font-size: 36px; margin-bottom: 20px; }}
        h2 {{ color: #3498db; margin-bottom: 30px; }}
        .loading {{ margin: 30px 0; }}
        a {{ color: #3498db; text-decoration: none; font-size: 18px; }}
        a:hover {{ text-decoration: underline; }}
    </style>
</head>
<body>
    <div class="logo">🏥</div>
    <h1>TV UBS Guarapuava</h1>
    <h2>Posto: {posto}</h2>
    <div class="loading">⏳ Carregando automaticamente...</div>
    <p><a href="{url}">Clique aqui se não redirecionar</a></p>
</body>
</html>"""
            
            # Salvar arquivo
            desktop = Path.home() / "Desktop"
            filename = f"TV-UBS-{posto}.html"
            filepath = desktop / filename
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            # Salvar configuração
            self.save_config()
            
            messagebox.showinfo(
                "Instalação Concluída!",
                f"✅ Arquivo criado: {filepath}\n\n"
                f"📋 Como usar:\n"
                f"1. Clique duplo no arquivo na área de trabalho\n"
                f"2. O navegador abrirá automaticamente\n"
                f"3. Pressione F11 para tela cheia\n"
                f"4. Deixe rodando na TV!\n\n"
                f"🔗 URL: {url}"
            )
            
        except Exception as e:
            messagebox.showerror("Erro", f"Erro ao criar arquivo:\n{str(e)}")
    
    def open_kiosk(self):
        url = self.url_label.cget("text")
        if not url or not url.startswith("http"):
            messagebox.showerror("Erro", "Configure o servidor e posto primeiro!")
            return
        
        # Tentar abrir em modo quiosque
        try:
            # Chrome em modo quiosque
            os.system(f'start chrome --kiosk "{url}"')
        except:
            try:
                # Firefox em modo tela cheia
                os.system(f'start firefox -private-window "{url}"')
            except:
                # Fallback para navegador padrão
                webbrowser.open(url)
        
        messagebox.showinfo("Modo Quiosque", 
                           "Abrindo em modo quiosque!\n\n"
                           "Pressione Alt+F4 para sair\n"
                           "ou Esc para sair do modo quiosque")
    
    def save_config(self):
        config = {
            "server_ip": self.server_ip.get(),
            "posto_code": self.posto_code.get(),
            "selected_posto": self.selected_posto.get()
        }
        
        try:
            config_path = Path.home() / "tv-ubs-config.json"
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2)
        except:
            pass  # Ignorar erros de salvamento
    
    def load_config(self):
        try:
            config_path = Path.home() / "tv-ubs-config.json"
            if config_path.exists():
                with open(config_path, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                
                self.server_ip.set(config.get("server_ip", "localhost"))
                self.posto_code.set(config.get("posto_code", ""))
                self.selected_posto.set(config.get("selected_posto", ""))
                
                # Atualizar interface
                if self.selected_posto.get() == "Personalizado":
                    self.custom_frame.pack(padx=10, pady=5, fill='x')
        except:
            pass  # Ignorar erros de carregamento
    
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = TVConfiguratorApp()
    app.run()
